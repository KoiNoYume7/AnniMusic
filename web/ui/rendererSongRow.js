import { playTrack } from "../ui/playerUI.js";
import { msToTime, formatDate } from "../utils/formatter.js";
import { queueDownload } from "../api/downloadSongs.js";

const API = "http://127.0.0.1:8000";

const statusTextMap = {
  "pending": "Pending",
  "downloading": "Downloading",
  "verifying": "Verifying",
  "available": "Available",
  "error": "Error",
  "online-only": "Online Only"
};

export function renderSongRow(song, index, statusMap) {
  const row = document.createElement("div");
  row.className = "song-row";
  row.dataset.songId = song.id;
  row.dataset.hasUrl = song.url ? "true" : "false";

  const statusBox = document.createElement("div");
  statusBox.className = "col status";
  const status = statusMap[song.id] || "online-only";

  statusBox.textContent = statusTextMap[status];
  statusBox.classList.add(`status-${status}`);

  const downloadableStatuses = ["online-only", "error"];

  if (downloadableStatuses.includes(status)) {
    statusBox.onclick = async () => {
      const res = await queueDownload(song.id);
      if (!res.error) {
        statusBox.textContent = "Pending";
        statusBox.className = "col status status-pending";
      } else {
        alert(`Failed to queue download: ${res.error}`);
      }
    };
    statusBox.title = "Click to download";
    statusBox.style.cursor = "pointer";
  } else {
    statusBox.title = status === "available" ? "Available Offline" : statusTextMap[status];
    statusBox.style.cursor = "default";
  }

  const num = document.createElement("div");
  num.className = "col index";
  num.textContent = index + 1;

  const coverWrapper = document.createElement("div");
  coverWrapper.className = "col cover-wrapper";
  const cover = new Image();
  cover.className = "cover-img";
  cover.src = song.image || "";
  cover.alt = "Cover";

  const playBtn = document.createElement("button");
  playBtn.className = "hover-play-btn";
  playBtn.textContent = "▶";
  playBtn.onclick = () => {
    const streamUrl = `${API}/stream/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.name)}`;
    playTrack(song.name, song.artist, streamUrl, song.id);
  };

  coverWrapper.append(cover, playBtn);

  const info = document.createElement("div");
  info.className = "col info";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = song.name;

  const artist = document.createElement("div");
  artist.className = "artist";
  artist.textContent = song.artist;

  info.append(title, artist);

  const album = document.createElement("div");
  album.className = "col album";
  album.textContent = song.album || "";

  const added = document.createElement("div");
  added.className = "col date";
  added.textContent = formatDate(song.added_at);

  const duration = document.createElement("div");
  duration.className = "col duration";
  duration.textContent = msToTime(song.duration_ms);

  row.append(num, coverWrapper, info, album, added, duration, statusBox);

  return row;
}