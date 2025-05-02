const API = "http://127.0.0.1:8000";
const list = document.getElementById("song-list");
const player = document.getElementById("player");

async function loadSongs() {
  const res = await fetch(`${API}/songs`);
  const songs = await res.json();

  if (!songs.length) {
    list.innerHTML = "<p>No liked songs found.</p>";
    return;
  }

  list.innerHTML = "";
  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.textContent = `${song.artist} - ${song.name}`;
    div.onclick = () => {
      const encodedArtist = encodeURIComponent(song.artist);
      const encodedTitle = encodeURIComponent(song.name);
      player.src = `${API}/stream/${encodedArtist}/${encodedTitle}`;
      player.play();
    };
    list.appendChild(div);
  });
}

loadSongs();
