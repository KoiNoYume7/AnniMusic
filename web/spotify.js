const API = "http://127.0.0.1:8000";

export async function playOnSpotify(trackUri) {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) {
      console.error("Spotify not authenticated.");
      return;
    }

    await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [trackUri] }),
    });
  } catch (err) {
    console.error("Spotify sync error:", err);
  }
}

export async function pauseOnSpotify() {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) return;

    await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    console.error("pauseOnSpotify() error:", err);
  }
}

export async function resumeOnSpotify() {
  try {
    const tokenRes = await fetch(`${API}/spotify/token`);
    const { access_token } = await tokenRes.json();

    if (!access_token) return;

    await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    console.error("resumeOnSpotify() error:", err);
  }
}