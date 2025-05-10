from fastapi import APIRouter
from fastapi.responses import JSONResponse
import traceback
from fastapi import HTTPException

from server.logic.status_handler import (
    load_json, save_json,
    queue_download, mark_validating_and_check,
    verify_downloads_from_markers
)
from server.core.shared import download_queue

import os
from fastapi import Request

DATA_DIR = "server/data/metadata"
DOWNLOAD_DIR = "server/data/downloads"
LIKED_TRACKS_FILE = os.path.join(DATA_DIR, "liked_tracks.json")
USER_DATA_FILE = os.path.join(DATA_DIR, "user_data.json")
from server.logic.status_handler import get_status_file

router = APIRouter()

@router.get("/songs")
def get_songs():
    songs = load_json(LIKED_TRACKS_FILE)
    user_data = load_json(USER_DATA_FILE)
    statuses = load_json(get_status_file(DATA_DIR))

    for song in songs:
        song_id = song['id']
        data = user_data.get(song_id, {})
        song['rating'] = data.get('rating')
        song['tags'] = data.get('tags')

        # Explicitly set initial status
        song['status'] = statuses.get(song_id, 'stream-only')

    return songs


@router.post("/metadata/{song_id}")
async def update_metadata(song_id: str, request: Request):
    user_data = load_json(USER_DATA_FILE)
    body = await request.json()
    song_data = user_data.get(song_id, {})
    song_data.update(body)
    user_data[song_id] = song_data
    save_json(USER_DATA_FILE, user_data)
    return {"status": "ok"}


@router.get("/download/{song_id}")
def download_single(song_id: str):
    try:
        return queue_download(song_id, LIKED_TRACKS_FILE, DATA_DIR, download_queue)
    except Exception as e:
        print(f"Error in download_single: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/all")
def download_all():
    songs = load_json(LIKED_TRACKS_FILE)
    for song in songs:
        queue_download(song['id'], LIKED_TRACKS_FILE, DATA_DIR, download_queue)
    return {"status": "all queued"}

@router.get("/downloads")
def list_downloaded_ids():
    return verify_downloads_from_markers(LIKED_TRACKS_FILE, DOWNLOAD_DIR)
