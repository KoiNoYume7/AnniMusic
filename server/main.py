from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from server.routes import songs, playlists, spotify, status_routes
from server.worker.downloader_thread import start_download_worker
from server.core.shared import download_queue

from server.logic import spotify_sync

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(songs.router)
app.include_router(playlists.router)
app.include_router(spotify.router)
app.include_router(status_routes.router)

start_download_worker(download_queue)

@app.on_event("startup")
async def sync_on_startup():
    print("🔁 Running Spotify sync on startup...")
    Path("server/data/metadata").mkdir(parents=True, exist_ok=True)
    Path("server/data/downloads").mkdir(parents=True, exist_ok=True)
    spotify_sync.run_sync()


app.mount("/", StaticFiles(directory="web", html=True), name="web")
