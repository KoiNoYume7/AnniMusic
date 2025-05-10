// utils/formatter.js

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function msToTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}