import { toggleSpotifySync, isSpotifySyncEnabled } from "./state.js";
import { togglePlayPause } from "./player.js";
import { loadPlaylists, loadPlaylistSongs, loadLikedSongs, startPolling } from "./ui.js";

console.log("✅ script.js is running");

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

window.onload = () => {
  const syncBtn = document.getElementById("sync-toggle");
  const playPauseBtn = document.getElementById("play-pause");

  console.log("✅ DOM is fully loaded");

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

  // Load playlists
  loadPlaylists();

  // ✅ Start polling
  startPolling();
};
