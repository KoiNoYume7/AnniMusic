let spotifySync = localStorage.getItem("spotifySync") === "true";

export function toggleSpotifySync() {
  spotifySync = !spotifySync;
  localStorage.setItem("spotifySync", spotifySync);
}

export function isSpotifySyncEnabled() {
  return spotifySync;
}