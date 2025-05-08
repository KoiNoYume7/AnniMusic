const audio = new Audio();
let currentSrc = null;
let currentTrackId = null;
let playing = false;

export function playTrack(title, artist, url, id) {
  console.log("=== PLAYTRACK ===");
  console.log("Track:", title, "|", artist);
  console.log("URL:", url);

  currentTrackId = id;

  if (currentSrc !== url) {
    audio.src = url;
    currentSrc = url;
  }

  audio.play();
  playing = true;
}

export function togglePlayPause() {
  if (!currentSrc) return;

  if (audio.paused) {
    audio.play();
    playing = true;
  } else {
    audio.pause();
    playing = false;
  }
}

export function isPlaying() {
  return playing;
}