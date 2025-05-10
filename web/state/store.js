// state/store.js

export function isSpotifySyncEnabled() {
  return localStorage.getItem("spotify-sync") === "true";
}

export function toggleSpotifySync() {
  const current = isSpotifySyncEnabled();
  localStorage.setItem("spotify-sync", (!current).toString());
}
