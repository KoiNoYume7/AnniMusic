import os
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

SCOPE = "user-library-read playlist-read-private user-follow-read user-read-playback-state user-modify-playback-state user-read-currently-playing"

def get_spotify_client() -> Spotify:
    return Spotify(auth_manager=SpotifyOAuth(
        scope=SCOPE,
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        cache_path=".cache-annimusic"
    ))
