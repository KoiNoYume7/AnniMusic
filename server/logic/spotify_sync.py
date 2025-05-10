# server/logic/spotify_sync.py

import json
from pathlib import Path
from server.logic.spotify_tools import get_spotify_client

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "metadata"
LIKED_TRACKS_FILE = DATA_DIR / "liked_tracks.json"
PLAYLISTS_FILE = DATA_DIR / "playlists.json"

DATA_DIR.mkdir(parents=True, exist_ok=True)

def fetch_liked_tracks(sp) -> list:
    print("🔄 Fetching liked tracks...")
    all_tracks = []
    results = sp.current_user_saved_tracks(limit=50)

    while results:
        for item in results['items']:
            track = item['track']
            if track is None:
                continue
            all_tracks.append({
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
        results = sp.next(results) if results.get('next') else None

    print(f"✅ {len(all_tracks)} liked tracks fetched.")
    return all_tracks

def fetch_playlists(sp):
    print("🔄 Fetching playlists...")
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

    print(f"✅ {len(playlists)} playlists fetched.")
    return playlists

def save_json(path, data):
    with open(str(path), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def run_sync():
    sp = get_spotify_client()
    liked = fetch_liked_tracks(sp)
    playlists = fetch_playlists(sp)
    save_json(LIKED_TRACKS_FILE, liked)
    save_json(PLAYLISTS_FILE, playlists)
    print("🎉 Sync complete. Data saved.")
