// state/connection.js

let isOnline = true;
let onStatusChange = null;

const API = "http://127.0.0.1:8000";

export function setStatusListener(callback) {
  onStatusChange = callback;
}

function updateStatus(status) {
  if (status !== isOnline) {
    isOnline = status;
    if (onStatusChange) onStatusChange(isOnline);
  }
}

export function isServerOnline() {
  return isOnline;
}

export function startServerWatchdog(interval = 5000) {
  setInterval(() => {
    fetch(`${API}/status`)
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        updateStatus(true);
      })
      .catch(() => updateStatus(false));
  }, interval);
}
