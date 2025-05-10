from fastapi import APIRouter
import os
from server.logic.status_handler import (
    load_json,
    get_status_file,
    mark_validating_and_check
)

router = APIRouter()

DATA_DIR = "server/data/metadata"
LIKED_TRACKS_FILE = os.path.join(DATA_DIR, "liked_tracks.json")
DOWNLOAD_DIR = "server/data/downloads"

@router.get("/status")
def get_status():
    try:
        return load_json(get_status_file(DATA_DIR))
    except Exception as e:
        return {"error": str(e)}

@router.post("/status/validate")
def validate_status():
    try:
        return mark_validating_and_check(LIKED_TRACKS_FILE, DATA_DIR, DOWNLOAD_DIR)
    except Exception as e:
        return {"error": str(e)}
