const API = "http://127.0.0.1:8000";

export async function queueDownload(songId) {
  try {
    const res = await fetch(`${API}/download/${songId}`);
    if (!res.ok) {
      throw new Error(`Download failed: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Download error:", err.message);
    return { error: err.message };
  }
}

export async function queueAllDownloads() {
  const res = await fetch(`${API}/download/all`);
  return await res.json();
}