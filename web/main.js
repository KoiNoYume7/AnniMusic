// web/main.js

import { fetchPlaylists } from "./api/getPlaylist.js";
import { fetchStatuses, validateStatuses } from "./api/fetchStatus.js";
import { renderSongRow } from "./ui/rendererSongRow.js";
import { renderPlaylistGrid } from "./ui/rendererPlaylistGrid.js";
import { togglePlayPause, isPlaying } from "./ui/playerUI.js";
import { isSpotifySyncEnabled, toggleSpotifySync } from "./state/store.js";
import { startServerWatchdog, setStatusListener } from "./state/connection.js";

const API = "http://127.0.0.1:8000";
const list = document.getElementById("song-list");
const syncBtn = document.getElementById("sync-toggle");
const playPauseBtn = document.getElementById("play-pause");

syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;

syncBtn.onclick = () => {
  toggleSpotifySync();
  syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;
};

playPauseBtn.onclick = () => {
  togglePlayPause();
  playPauseBtn.textContent = isPlaying() ? "⏸" : "▶";
};

setStatusListener((online) => {
  if (!online) {
    const banner = document.getElementById("server-banner");
    if (online) {
      banner.style.display = "none";
    } else {
      banner.style.display = "block";
    }
  }
});

export async function loadLikedSongs() {
  const [songsRes, statusMap] = await Promise.all([
    fetch(`${API}/songs`).then(r => r.json()),
    fetchStatuses()
  ]);

  list.innerHTML = `<h2>Liked Songs</h2>`;
  renderListHeader();
  songsRes.forEach((song, i) => {
    list.appendChild(renderSongRow(song, i, statusMap));
  });
}

export async function loadPlaylistSongs(id, name) {
  const [tracks, statusMap] = await Promise.all([
    fetch(`${API}/playlist/${id}`).then(r => r.json()),
    fetchStatuses()
  ]);
  list.innerHTML = `<h2>${name}</h2>`;
  renderListHeader();
  tracks.forEach((song, i) => {
    list.appendChild(renderSongRow(song, i, statusMap));
  });
}

export async function loadPlaylists() {
  const playlists = await fetchPlaylists();
  playlists.unshift({
    name: "Liked Songs",
    id: "__liked__",
    track_count: "auto",
    image: "assets/AnniMusic-LikedSongs.png"
  });

  list.innerHTML = `<h2>Your Playlists</h2>`;
  const grid = renderPlaylistGrid(playlists);
  list.appendChild(grid);
}

function renderListHeader() {
  const header = document.createElement("div");
  header.className = "song-header-row";
  header.innerHTML = `
    <div class="col index">#</div>
    <div class="col cover">Cover</div>
    <div class="col info">Title</div>
    <div class="col album">Album</div>
    <div class="col date">Added</div>
    <div class="col duration">Length</div>
    <div class="col status">
      <div>Status</div>
      <button class="download-all-btn">Download All</button>
    </div>
  `;
  header.querySelector(".download-all-btn").onclick = () => {
    fetch(`${API}/download/all`).then(() => alert("All liked songs queued."));
  };
  list.appendChild(header);
}

async function startPolling() {
  setInterval(async () => {
    const statusMap = await fetchStatuses();
    updateAllStatuses(statusMap);
    await validateStatuses();  // Backend-side check
  }, 2000);
}

function updateAllStatuses(statusMap) {
  document.querySelectorAll('.song-row').forEach(row => {
    const songId = row.dataset.songId;
    const status = statusMap[songId];
    const statusBox = row.querySelector('.status');

    statusBox.textContent = status;

    statusBox.classList.remove(
      'status-queued',
      'status-downloading',
      'status-validating',
      'status-downloaded',
      'status-failed',
      'status-stream-only'
    );

    statusBox.classList.add(`status-${status}`);
  });
}

window.onload = () => {
  // Add server status banner
  const banner = document.createElement("div");
  banner.id = "server-banner";
  banner.textContent = "🔴 Server Offline – some features may not work.";
  banner.style.display = "none";
  document.body.prepend(banner);

  // Load initial content
  if (location.hash === "#liked") {
    loadLikedSongs();
  } else {
    loadPlaylists();
  }

  // Start validation + server health checks
  startPolling();
  startServerWatchdog();
};

setStatusListener((online) => {
  const banner = document.getElementById("server-banner");
  if (!banner) return;
  banner.style.display = online ? "none" : "block";
});


window.onpopstate = (e) => {
  const state = e.state;
  if (!state || state.type === "home") loadPlaylists();
  else if (state.type === "liked") loadLikedSongs();
  else if (state.type === "playlist") loadPlaylistSongs(state.id, state.name);
};
