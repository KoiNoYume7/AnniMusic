const audio = new Audio();
let currentSrc = null;
let currentTrackId = null;
let playing = false;

export function playTrack(title, artist, url, id) {
  currentTrackId = id;
  if (currentSrc !== url) {
    audio.src = url;
    currentSrc = url;
  }
  audio.play();
  playing = true;
  updateTrackInfo(title, artist);
}

export function togglePlayPause() {
  if (!currentSrc) return false;
  if (audio.paused) {
    audio.play();
    playing = true;
  } else {
    audio.pause();
    playing = false;
  }
  return playing;
}

export function isPlaying() {
  return playing;
}

function updateTrackInfo(title, artist) {
  const info = document.getElementById("track-info");
  if (info) {
    info.textContent = `${title} – ${artist}`;
  }
}