import json
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess
from dotenv import load_dotenv
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import threading
import time
from queue import Queue

app = FastAPI()
download_queue = Queue()

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

    # Mark as queued
    status_file = os.path.join(DATA_DIR, "status.json")
    status = load_json(status_file)
    status[song_id] = "queued"
    save_json(status_file, status)

    # Add to queue
    download_queue.put(song)

    return {"status": "queued"}


@app.get("/downloads")
def list_downloaded_ids():
    songs = load_json(LIKED_TRACKS_FILE)
    file_names = os.listdir(DOWNLOAD_DIR)
    downloaded_ids = []

    for song in songs:
        artist = song["artist"].replace("/", "_")
        title = song["name"].replace("/", "_")
        expected_start = f"{artist} - {title}".lower()

        for file in file_names:
            if file.lower().startswith(expected_start):
                downloaded_ids.append(song["id"])
                break

    return downloaded_ids

@app.post("/status/validate")
def validate_download_status():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    songs = load_json(LIKED_TRACKS_FILE)
    status = load_json(os.path.join(DATA_DIR, "status.json"))
    file_names = os.listdir(DOWNLOAD_DIR)

    updated = False

    for song in songs:
        song_id = song["id"]
        artist = song["artist"].replace("/", "_")
        title = song["name"].replace("/", "_")
        expected_prefix = f"{artist} - {title}".lower()

        found = any(file.lower().startswith(expected_prefix) for file in file_names)

        correct_status = "downloaded" if found else "not-downloaded"
        if status.get(song_id) not in ["queued", "downloading", "failed"] and status.get(song_id) != correct_status:
            status[song_id] = correct_status
            updated = True

    if updated:
        save_json(os.path.join(DATA_DIR, "status.json"), status)

    return {"status": "validated", "changes_applied": updated}




@app.get("/download/all")
def download_all():
    songs = load_json(LIKED_TRACKS_FILE)
    status_file = os.path.join(DATA_DIR, "status.json")
    status = load_json(status_file)

    for song in songs:
        song_id = song["id"]
        url = song.get("url")
        if not url or status.get(song_id) in ["downloaded", "queued", "downloading"]:
            continue

        status[song_id] = "queued"
        download_queue.put(song)

    save_json(status_file, status)
    return {"status": "all queued"}

@app.get("/queue")
def get_queue_length():
    return {"queued": download_queue.qsize()}



@app.get("/status")
def get_status():
    status_file = os.path.join(DATA_DIR, "status.json")
    return load_json(status_file)

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

def background_downloader():
    while True:
        song = download_queue.get()
        if song is None:
            break  # allows clean shutdown

        song_id = song['id']
        url = song['url']

        status_file = os.path.join(DATA_DIR, "status.json")
        status = load_json(status_file)
        status[song_id] = "downloading"
        save_json(status_file, status)

        print(f"Downloading: {song['artist']} - {song['name']}")

        try:
            result = subprocess.run([
                "spotdl", "download", url,
                "--ffmpeg-args=-b:a 192k",
                "--output", DOWNLOAD_DIR
            ], capture_output=True, text=True)

            # Check if any matching file was written
            song_filename_prefix = f"{song['artist']} - {song['name']}".replace("/", "_").lower()
            downloaded = False

            for file in os.listdir(DOWNLOAD_DIR):
                if file.lower().startswith(song_filename_prefix):
                    downloaded = True
                    break

            status[song_id] = "downloaded" if downloaded else "failed"

        except subprocess.CalledProcessError:
            status[song_id] = "failed"

        save_json(status_file, status)
        download_queue.task_done()



threading.Thread(target=background_downloader, daemon=True).start()
app.mount("/", StaticFiles(directory="web", html=True), name="web")