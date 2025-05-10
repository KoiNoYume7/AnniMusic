from fastapi import APIRouter
import os
from server.logic.status_handler import load_json
from server.logic.spotify_tools import get_spotify_client

router = APIRouter()

DATA_DIR = "server/data/metadata"
PLAYLISTS_FILE = os.path.join(DATA_DIR, "playlists.json")
LIKED_TRACKS_FILE = os.path.join(DATA_DIR, "liked_tracks.json")

@router.get("/playlists")
def get_playlists():
    return load_json(PLAYLISTS_FILE)

@router.get("/playlist/{playlist_id}")
def get_playlist_tracks(playlist_id: str):
    sp = get_spotify_client()
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