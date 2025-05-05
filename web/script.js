const API = "http://127.0.0.1:8000";
const list = document.getElementById("song-list");

let currentTrackId = null;
let playing = false;

function msToTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffWeeks = diffDays / 7;

  if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
  if (diffDays < 7) return `${Math.floor(diffDays)} days ago`;
  if (diffWeeks < 5) return `${Math.floor(diffWeeks)} weeks ago`;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

async function loadSongs() {
  const [songsRes, statusRes] = await Promise.all([
    fetch(`${API}/songs`),
    fetch(`${API}/status`)
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

    // -- Track Number / Hover Player
    const num = document.createElement("div");
    num.className = "col index play-hover";
    num.textContent = index + 1;

    const playBtn = document.createElement("button");
    playBtn.className = "hover-play-btn";
    playBtn.textContent = "▶";
    playBtn.onclick = (e) => {
      e.stopPropagation();
      const a = encodeURIComponent(song.artist);
      const t = encodeURIComponent(song.name);
      const url = `${API}/stream/${a}/${t}`;
      playTrack(song.name, song.artist, url, song.id, song.uri);

      if (currentTrackId === song.id && playing) {
        audio.pause();
        playing = false;
        playBtn.textContent = "▶";
      } else {
        if (currentSrc !== url) {
          audio.src = url;
          currentSrc = url;
        }
        audio.play();
        currentTrackId = song.id;
        playing = true;
        playBtn.textContent = "⏸";
      }      
    };

    num.appendChild(playBtn);

    // -- Cover
    const cover = document.createElement("img");
    cover.className = "col cover img";
    cover.src = song.image || "";
    cover.alt = "Cover";

    // -- Title & Artist
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

    // -- Status
    const statusBox = document.createElement("div");
    statusBox.className = "col status";

    const currentStatus = status[song.id] || "pending";
    statusBox.textContent = currentStatus;
    statusBox.classList.add("status-" + currentStatus);

    statusBox.onclick = () => {
      fetch(`${API}/download/${song.id}`).then(() => {
        statusBox.textContent = "downloading...";
        statusBox.className = "col status status-downloading";
      });
    };

    row.append(num, cover, info, album, added, duration, statusBox);
    list.appendChild(row);
  });
}
loadSongs();

const audio = new Audio();
let currentSrc = null;
let spotifySync = localStorage.getItem("spotifySync") === "true";

const playPauseBtn = document.getElementById("play-pause");
const trackInfo = document.getElementById("track-info");
const syncBtn = document.getElementById("sync-toggle");

syncBtn.textContent = `Spotify: ${spotifySync ? "ON" : "OFF"}`;

syncBtn.onclick = () => {
  spotifySync = !spotifySync;
  localStorage.setItem("spotifySync", spotifySync);
  syncBtn.textContent = `Spotify: ${spotifySync ? "ON" : "OFF"}`;
};

function playTrack(title, artist, url, id, spotifyUri) {

  console.log("=== PLAYTRACK ===");
  console.log("Mode:", spotifySync ? "SPOTIFY" : "LOCAL");
  console.log("Track:", title, "|", artist);
  console.log("URL:", url);
  console.log("Spotify URI:", spotifyUri);


  currentTrackId = id;
  trackInfo.textContent = `${title} — ${artist}`;
  playPauseBtn.textContent = "⏸";

  if (spotifySync) {
    console.log(`[SPOTIFY] Syncing to: ${title}`);
    playOnSpotify(spotifyUri);
  } else {
    if (currentSrc !== url) {
      audio.src = url;
      currentSrc = url;
    }
    audio.play();
    console.log("Calling audio.play()...");
  }

  playing = true;
}

playPauseBtn.onclick = () => {
  if (spotifySync) {
    if (playing) {
      pauseOnSpotify();
      playPauseBtn.textContent = "▶";
    } else {
      resumeOnSpotify();
      playPauseBtn.textContent = "⏸";
    }
  } else {
    if (!currentSrc) return;
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "⏸";
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶";
    }
  }

  playing = !playing;
};

async function playOnSpotify(trackUri) {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) {
      console.error("Spotify not authenticated.");
      return;
    }

    const res = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    });

    if (!res.ok) {
      console.error("Spotify play failed:", await res.json());
    }
  } catch (err) {
    console.error("Spotify sync error:", err);
  }
}

async function pauseOnSpotify() {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) return console.error("No Spotify token.");

    const res = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!res.ok) {
      console.error("Spotify pause failed:", await res.json());
    }
  } catch (err) {
    console.error("pauseOnSpotify() error:", err);
  }
}

async function resumeOnSpotify() {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) return console.error("No Spotify token.");

    const res = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!res.ok) {
      console.error("Spotify resume failed:", await res.json());
    }
  } catch (err) {
    console.error("resumeOnSpotify() error:", err);
  }
}
