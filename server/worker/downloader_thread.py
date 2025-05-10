import subprocess
from queue import Queue
import threading
import os
from server.logic.status_handler import mark_status
from server.core.shared import download_queue

DOWNLOAD_DIR = "server/data/downloads"

def download_worker(queue: Queue):
    while True:
        song = queue.get()
        if song is None:
            break

        song_id = song['id']
        url = song['url']
        mark_status(song_id, "downloading", "server/data/metadata")

        artist = song['artist'].replace("/", "_")
        title = song['name'].replace("/", "_")
        song_filename_prefix = f"{artist} - {title}".lower()

        try:
            result = subprocess.run([
                "spotdl", "download", url,
                "--ffmpeg-args=-b:a 192k",
                "--output", f"{DOWNLOAD_DIR}/{{artist}} - {{title}}"
            ], capture_output=True, text=True, check=True)

            # Logging output clearly:
            print(f"SpotDL Output for {title}:\n{result.stdout}\n{result.stderr}")

            downloaded_files = [f.lower() for f in os.listdir(DOWNLOAD_DIR)]
            if any(file.startswith(song_filename_prefix) for file in downloaded_files):
                marker = os.path.join(DOWNLOAD_DIR, f"{song_filename_prefix}.finished")
                with open(marker, "w") as f:
                    f.write("done")
                mark_status(song_id, "validating", "server/data/metadata")
            else:
                print(f"⚠️ No file matched the prefix '{song_filename_prefix}' after download.")
                mark_status(song_id, "failed", "server/data/metadata")

        except subprocess.CalledProcessError as e:
            print(f"🚨 SpotDL failed for {title}:")
            print("stdout:", e.stdout)
            print("stderr:", e.stderr)
            mark_status(song_id, "failed", "server/data/metadata")

        queue.task_done()

def start_download_worker(queue: Queue):
    threading.Thread(target=download_worker, args=(queue,), daemon=True).start()
