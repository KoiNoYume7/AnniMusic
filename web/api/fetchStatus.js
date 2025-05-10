// fetchStatus.js
const API = "http://127.0.0.1:8000";

export async function fetchStatuses() {
  try {
    const res = await fetch(`${API}/status`);
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch statuses:", err.message);
    return {};
  }
}

export async function validateStatuses() {
  try {
    const res = await fetch(`${API}/status/validate`, { method: "POST" });
    if (!res.ok) throw new Error("Validation failed");
    return await res.json();
  } catch (err) {
    console.warn("Validation error:", err.message);
    return {};
  }
}
