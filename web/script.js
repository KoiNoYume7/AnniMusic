import { loadSongs } from "./ui.js";
//import { loadPlaylists } from "./ui.js";
import { toggleSpotifySync, isSpotifySyncEnabled } from "./state.js";
import { togglePlayPause } from "./player.js";
import { loadPlaylists, loadPlaylistSongs, loadLikedSongs } from "./ui.js";

// Handle browser 


// Handle browser back/forward navigation
window.onpopstate = (event) => {
  const state = event.state;

  if (!state || state.type === "home") {
    loadPlaylists();
  } else if (state.type === "liked") {
    loadLikedSongs();
  } else if (state.type === "playlist") {
    loadPlaylistSongs(state.id, state.name);
  }
};

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
loadPlaylists();

