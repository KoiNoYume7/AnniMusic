import { loadPlaylistSongs, loadLikedSongs } from "../main.js";

export function renderPlaylistGrid(playlists) {
  const container = document.createElement("div");
  container.className = "playlist-grid";

  playlists.forEach((playlist) => {
    const box = document.createElement("div");
    box.className = "playlist-box";
    box.innerHTML = `
      <img class="playlist-cover" src="${playlist.image || 'default.jpg'}" alt="Cover">
      <div class="playlist-name">${playlist.name}</div>
      <div class="playlist-tracks">${playlist.track_count} tracks</div>
    `;
    box.onclick = () => {
      if (playlist.id === "__liked__") loadLikedSongs();
      else loadPlaylistSongs(playlist.id, playlist.name);
    };
    container.appendChild(box);
  });

  return container;
}