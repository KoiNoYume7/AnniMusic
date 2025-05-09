import json
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import subprocess
from dotenv import load_dotenv
from pathlib import Path

app = FastAPI()

# Load .env from project root
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

from spotipy.oauth2 import SpotifyOAuth

SPOTIFY_SCOPE = "user-library-read playlist-read-private user-follow-read user-read-playback-state user-modify-playback-state user-read-currently-playing"

spotify_auth = SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope=SPOTIFY_SCOPE,
    cache_path=".cache-annimusic"
)

@app.get("/spotify/token")
def get_spotify_token():
    try:
        token_info = spotify_auth.get_access_token(as_dict=True)
        return {"access_token": token_info["access_token"]}
    except Exception as e:
        return {"error": str(e)}

DATA_DIR = "data/metadata"
DOWNLOAD_DIR = "data/downloads"
USER_DATA_FILE = f"{DATA_DIR}/user_data.json"
LIKED_TRACKS_FILE = f"{DATA_DIR}/liked_tracks.json"
PLAYLISTS_FILE = f"{DATA_DIR}/playlists.json"


# CORS, etc. (same as before)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.get("/songs")
def get_songs():
    songs = load_json(LIKED_TRACKS_FILE)
    user_data = load_json(USER_DATA_FILE)

    # Merge song + user metadata
    for song in songs:
        data = user_data.get(song['id'], {})
        song['rating'] = data.get('rating')
        song['tags'] = data.get('tags')
    return songs

@app.post("/metadata/{song_id}")
async def update_metadata(song_id: str, request: Request):
    user_data = load_json(USER_DATA_FILE)
    body = await request.json()

    song_data = user_data.get(song_id, {})
    song_data.update(body)
    user_data[song_id] = song_data

    save_json(USER_DATA_FILE, user_data)
    return {"status": "ok"}

@app.get("/download/{song_id}")
def download_single(song_id: str):
    songs = load_json(LIKED_TRACKS_FILE)
    song = next((s for s in songs if s['id'] == song_id), None)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    url = song.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="No URL found")

    subprocess.Popen([
    "spotdl", "download", url,
    "--ffmpeg-args=-b:a 192k",
    "--output", DOWNLOAD_DIR
])
    return {"status": "queued"}

@app.get("/download/all")
def download_all():
    songs = load_json(LIKED_TRACKS_FILE)
    for song in songs:
        url = song.get("url")
        if not url:
            continue
        subprocess.Popen([
            "spotdl", url,
            "--output", f"{DOWNLOAD_DIR}/{{artist}} - {{title}}.{{output-ext}}",
            "--overwrite", "skip"
        ])
    return {"status": "download started"}

@app.get("/status")
def get_status():
    status_file = os.path.join(DATA_DIR, "status.json")
    return load_json(status_file)

@app.get("/stream/{artist}/{title}")
def stream_song(artist: str, title: str):
    from urllib.parse import unquote

@app.get("/playlists")
def get_playlists():
    return load_json(PLAYLISTS_FILE)


@app.get("/playlist/{playlist_id}")
def get_playlist_tracks(playlist_id: str):
    from spotipy import Spotify
    from spotipy.oauth2 import SpotifyOAuth

    sp = Spotify(auth_manager=SpotifyOAuth(
        scope="playlist-read-private",
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        cache_path=".cache-annimusic"
    ))

    results = sp.playlist_tracks(playlist_id, limit=100)
    tracks = []

    for item in results['items']:
        track = item['track']
        if track is None:
            continue
        tracks.append({
            'id': track['id'],
            'name': track['name'],
            'artist': track['artists'][0]['name'],
            'album': track['album']['name'],
            'duration_ms': track['duration_ms'],
            'uri': track['uri'],
            'url': track['external_urls']['spotify'],
            'image': track['album']['images'][0]['url'] if track['album']['images'] else None,
            'added_at': item.get('added_at', '')
        })

    return tracks


    # Decode and normalize input
    artist = unquote(artist).replace("/", "_").lower()
    title = unquote(title).replace("/", "_").lower()

    for file in os.listdir(DOWNLOAD_DIR):
        filename = file.lower().replace("_", " ").replace("-", " ")
        if artist in filename and title in filename:
            path = os.path.join(DOWNLOAD_DIR, file)
            return FileResponse(path, media_type="audio/mpeg")

    raise HTTPException(status_code=404, detail="Song not found")