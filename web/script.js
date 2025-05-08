import { loadSongs } from "./ui.js";
import { toggleSpotifySync, isSpotifySyncEnabled } from "./state.js";
import { togglePlayPause } from "./player.js";

const syncBtn = document.getElementById("sync-toggle");
const playPauseBtn = document.getElementById("play-pause");

// Initialize Spotify sync button state
syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;

// Handle Spotify sync toggle
syncBtn.onclick = () => {
  toggleSpotifySync();
  syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;
};

// Handle play/pause button
playPauseBtn.onclick = () => {
  togglePlayPause();
  playPauseBtn.textContent = togglePlayPause() ? "⏸" : "▶";
};

// Load songs into the UI
loadSongs();
