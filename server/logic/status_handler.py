import os
import json
import glob

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_status_file(data_dir):
    return os.path.join(data_dir, "status.json")

def queue_download(song_id, track_file, data_dir, queue):
    tracks = load_json(track_file)
    status = load_json(get_status_file(data_dir))
    song = next((s for s in tracks if s['id'] == song_id), None)
    if not song or not song.get("url"):
        return {"error": "Invalid song or URL missing."}

    if status.get(song_id) in ["queued", "downloading", "downloaded"]:
        return {"status": "already handled"}

    status[song_id] = "queued"
    save_json(get_status_file(data_dir), status)
    queue.put(song)
    return {"status": "queued"}

def mark_status(song_id, value, data_dir):
    status = load_json(get_status_file(data_dir))
    status[song_id] = value
    save_json(get_status_file(data_dir), status)

def verify_downloads_from_markers(track_file, download_dir):
    tracks = load_json(track_file)
    finished_ids = []
    for track in tracks:
        artist = track["artist"].replace("/", "_")
        title = track["name"].replace("/", "_")
        prefix = f"{artist} - {title}".lower()
        marker = os.path.join(download_dir, f"{prefix}.finished")
        if os.path.isfile(marker):
            finished_ids.append(track["id"])
    return finished_ids

def mark_validating_and_check(track_file, data_dir, download_dir):
    tracks = load_json(track_file)
    status = load_json(get_status_file(data_dir))
    updated_ids = []

    for track in tracks:
        song_id = track["id"]
        artist = track["artist"].replace("/", "_")
        title = track["name"].replace("/", "_")
        song_filename_prefix = f"{artist} - {title}".lower()
        
        mp3_files = glob.glob(os.path.join(download_dir, f"{song_filename_prefix}*.mp3"))
        marker_file = os.path.join(download_dir, f"{song_filename_prefix}.finished")

        current_status = status.get(song_id)

        if mp3_files and os.path.isfile(marker_file):
            if current_status != "downloaded":
                status[song_id] = "downloaded"
                updated_ids.append(song_id)
        elif current_status in ["downloaded", "validating", "downloading"]:
            # File or marker missing, revert status to stream-only or failed
            status[song_id] = "failed"
            updated_ids.append(song_id)

    if updated_ids:
        save_json(get_status_file(data_dir), status)

    return {"validated": updated_ids}

