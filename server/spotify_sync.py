import os
import json
import time
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Load .env
load_dotenv()

# Auth scopes
SCOPE = "user-library-read playlist-read-private user-follow-read user-read-playback-state"

# Spotify auth
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    scope=SCOPE,
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    cache_path=".cache-annimusic"
))

DATA_DIR = "data/metadata"
LIKED_TRACKS_FILE = os.path.join(DATA_DIR, "liked_tracks.json")
PLAYLISTS_FILE = os.path.join(DATA_DIR, "playlists.json")

os.makedirs(DATA_DIR, exist_ok=True)

# === MAIN FUNCTIONS ===

def fetch_liked_tracks() -> list[dict]:
    try:
        print("Fetching liked tracks...")
        all_tracks = []
        results = sp.current_user_saved_tracks(limit=50)
        while results:
            for item in results['items']:
                track = item['track']
                all_tracks.append({
                    'id': track['id'],
                    'name': track['name'],
                    'artist': track['artists'][0]['name'],
                    'album': track['album']['name'],
                    'duration_ms': track['duration_ms'],
                    'uri': track['uri'],
                    'url': track['external_urls']['spotify'],
                    'image': track['album']['images'][0]['url'] if track['album']['images'] else None,
                    'added_at': item['added_at']
                })
            results = sp.next(results) if results['next'] else None
        print(f"{len(all_tracks)} tracks fetched.")
        return all_tracks
    except Exception as e:
        print(f"Error fetching liked tracks: {e}")
        return []

def fetch_playlists():
    print("Fetching playlists...")
    playlists = []
    results = sp.current_user_playlists(limit=50)
    for item in results['items']:
        playlists.append({
            'name': item['name'],
            'id': item['id'],
            'uri': item['uri'],
            'track_count': item['tracks']['total'],
            'image': item['images'][0]['url'] if item['images'] else None
        })

    print(f"{len(playlists)} playlists fetched.")
    return playlists

def save_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def run_sync():
    liked = fetch_liked_tracks()
    playlists = fetch_playlists()
    save_json(LIKED_TRACKS_FILE, liked)
    save_json(PLAYLISTS_FILE, playlists)
    print("Sync complete! Metadata saved.")

# === RUN ===
if __name__ == "__main__":
    run_sync()
