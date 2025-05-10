const API = "http://127.0.0.1:8000";

export async function fetchPlaylists() {
  const res = await fetch(`${API}/playlists`);
  return await res.json();
}

export async function fetchPlaylistTracks(id) {
  const res = await fetch(`${API}/playlist/${id}`);
  return await res.json();
}