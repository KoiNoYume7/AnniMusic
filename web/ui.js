import { playTrack, togglePlayPause, isPlaying } from "./player.js";
import { formatDate, msToTime } from "./utils.js";
import { toggleSpotifySync, isSpotifySyncEnabled } from "./state.js";

const API = "http://127.0.0.1:8000";
const list = document.getElementById("song-list");
const playPauseBtn = document.getElementById("play-pause");
const syncBtn = document.getElementById("sync-toggle");

// Initialize Spotify sync button state
syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;

// === Utility Functions ===

// Create the header row for the song list
function createHeaderRow() {
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
  return header;
}

// Create a row for an individual song
function createSongRow(song, index, status) {
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
  return row;
}

// Create a playlist box
function createPlaylistBox(playlist, onClick) {
  const box = document.createElement("div");
  box.className = "playlist-box";
  box.innerHTML = `
    <img class="playlist-cover" src="${playlist.image || 'default.jpg'}" alt="Cover">
    <div class="playlist-name">${playlist.name}</div>
    <div class="playlist-tracks">${playlist.track_count} tracks</div>
  `;

  box.onclick = onClick;
  return box;
}

// === Main Functions ===

// Load all songs
export async function loadSongs() {
  try {
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
    list.appendChild(createHeaderRow());

    songs.forEach((song, index) => {
      const row = createSongRow(song, index, status);
      list.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading songs:", error);
    list.innerHTML = "<p>Failed to load songs. Please try again later.</p>";
  }
}

// Load playlists
export async function loadPlaylists(shouldPush = true) {
  try {
    if (shouldPush) {
      history.pushState({ type: "home" }, "", "#");
    }

    const res = await fetch(`${API}/playlists`);
    let playlists = await res.json();

    // Inject fake "Liked Songs" at the top
    playlists.unshift({
      name: "Liked Songs",
      id: "__liked__",
      track_count: "auto",
      image: "assets/AnniMusic-LikedSongs.png",
    });

    list.innerHTML = "<h2>Your Playlists</h2>";
    const grid = document.createElement("div");
    grid.className = "playlist-grid";

    playlists.forEach((playlist) => {
      const box = createPlaylistBox(playlist, () => {
        if (playlist.id === "__liked__") {
          loadLikedSongs(); // will also get the shouldPush default
        } else {
          loadPlaylistSongs(playlist.id, playlist.name); // same here
        }
      });
      grid.appendChild(box);
    });

    list.appendChild(grid);
  } catch (error) {
    console.error("Error loading playlists:", error);
    list.innerHTML = "<p>Failed to load playlists. Please try again later.</p>";
  }
}


// Load liked songs
export async function loadLikedSongs(shouldPush = true) {
  if (shouldPush) {
    history.pushState({ type: "liked" }, "", "#liked");
  }

  const [songsRes, statusRes] = await Promise.all([
    fetch(`${API}/songs`),
    fetch(`${API}/status`),
  ]);
  const songs = await songsRes.json();
  const status = await statusRes.json();

  loadSongsList(songs, "Liked Songs", status);
}


// Load songs from a playlist
export async function loadPlaylistSongs(id, name, shouldPush = true) {
  if (shouldPush) {
    history.pushState({ type: "playlist", id, name }, "", `#playlist-${id}`);
  }

  const res = await fetch(`${API}/playlist/${id}`);
  const songs = await res.json();

  if (!songs.length) {
    list.innerHTML = `<h2>${name}</h2><p>No songs found in this playlist.</p>`;
    return;
  }

  loadSongsList(songs, name);
}


// Render a list of songs
function loadSongsList(songs, title, status = {}){
  list.innerHTML = `<h2>${title}</h2>`;
  list.appendChild(createHeaderRow());

  songs.forEach((song, index) => {
    const row = createSongRow(song, index, status);
    list.appendChild(row);
  });
}

// === Event Listeners ===
syncBtn.onclick = () => {
  toggleSpotifySync();
  syncBtn.textContent = `Spotify: ${isSpotifySyncEnabled() ? "ON" : "OFF"}`;
};

playPauseBtn.onclick = () => {
  togglePlayPause();
  playPauseBtn.textContent = isPlaying() ? "⏸" : "▶";
};