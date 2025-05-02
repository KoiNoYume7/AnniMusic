import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
DATA_DIR = "data/metadata"
DOWNLOAD_DIR = "data/downloads"

# Enable CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this down later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/songs")
def get_songs():
    return load_json(os.path.join(DATA_DIR, "liked_tracks.json"))

@app.get("/playlists")
def get_playlists():
    return load_json(os.path.join(DATA_DIR, "playlists.json"))

@app.get("/status")
def get_status():
    return load_json(os.path.join(DATA_DIR, "status.json"))

@app.get("/stream/{artist}/{title}")
def stream_song(artist: str, title: str):
    safe_filename = f"{artist} - {title}".replace("/", "_")
    for file in os.listdir(DOWNLOAD_DIR):
        if file.startswith(safe_filename):
            path = os.path.join(DOWNLOAD_DIR, file)
            return FileResponse(path, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Song not found")
