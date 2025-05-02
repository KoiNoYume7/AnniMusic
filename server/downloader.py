import os
import json
import subprocess

DOWNLOAD_DIR = "data/downloads"
LIKED_TRACKS_FILE = "data/metadata/liked_tracks.json"
STATUS_FILE = "data/metadata/status.json"

def load_tracks():
    with open(LIKED_TRACKS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_status():
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_status(status):
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2, ensure_ascii=False)

def song_exists(track):
    safe_name = f"{track['artist']} - {track['name']}".replace("/", "_")
    for file in os.listdir(DOWNLOAD_DIR):
        if file.startswith(safe_name):
            return True
    return False

def download_song(track):
    query = f"{track['name']} {track['artist']}"
    try:
        subprocess.run([
            "spotdl", query,
            "--output", f"{DOWNLOAD_DIR}/{{artist}} - {{title}}.{{output-ext}}",
            "--overwrite", "skip"
        ], check=True)
        return "downloaded"
    except subprocess.CalledProcessError:
        return "failed"

def main():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    tracks = load_tracks()
    status = load_status()

    for track in tracks:
        track_id = track["id"]
        if track_id in status and status[track_id] == "downloaded":
            print(f"Already downloaded: {track['artist']} - {track['name']}")
            continue

        if song_exists(track):
            print(f"File exists locally (marking as downloaded): {track['artist']} - {track['name']}")
            status[track_id] = "downloaded"
            continue

        result = download_song(track)
        status[track_id] = result
        print(f"{result.title()}: {track['artist']} - {track['name']}")

        save_status(status)

if __name__ == "__main__":
    main()
