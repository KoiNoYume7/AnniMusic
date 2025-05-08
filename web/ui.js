import { playTrack, togglePlayPause, isPlaying } from "./player.js";
import { formatDate, msToTime } from "./utils.js";
import { toggleSpotifySync, isSpotifySyncEnabled } from "./state.js";

const API = "http://127.0.0.1:8000";
const list = document.getElementById("song-list");
const playPauseBtn = document.getElementById("play-pause");
const syncBtn = document.getElementById("sync-toggle");

export async function loadSongs() {
  const [songsRes, statusRes] = await Promise.all([
    fetch(`${API}/songs`),
    fetch(`${API}/status`),
  ]);

  const songs = await songsRes.json();
  const status = await statusRes.json();

  if (!songs.length) {
    list.innerHTML = "<p>No liked songs found.</p>";
    return;
  }

  list.innerHTML = "";

  const header = document.createElement("div");
  header.className = "song-header-row";
  header.innerHTML = `
    <div class="col index">#</div>
    <div class="col cover">Cover</div>
    <div class="col info">Title</div>
    <div class="col album">Album</div>
    <div class="col date">Added</div>
    <div class="col duration">Length</div>
    <div class="col status">Status</div>
  `;
  list.appendChild(header);

  songs.forEach((song, index) => {
    const row = document.createElement("div");
    row.className = "song-row";

    const num = document.createElement("div");
    num.className = "col index";
    num.textContent = index + 1;

    const cover = document.createElement("img");
    cover.className = "col cover img";
    cover.src = song.image || "";
    cover.alt = "Cover";

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

    const statusBox = document.createElement("div");
    statusBox.className = "col status";
    statusBox.textContent = status[song.id] || "pending";

    row.append(num, cover, info, album, added, duration, statusBox);
    list.appendChild(row);
  });
}

syncBtn.onclick = () => {
  toggleSpotifySync();
  syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;
};

playPauseBtn.onclick = () => {
  togglePlayPause();
  playPauseBtn.textContent = isPlaying() ? "⏸" : "▶";
};