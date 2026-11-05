// Dates are stored as "YYYY-MM-DD". These helpers use the user's local time,
// because toISOString() is UTC and can return yesterday's or tomorrow's date.
export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDate(isoDate) {
  if (!isoDate) return "Not set";

  // The T00:00:00 makes JavaScript read this as local time, not UTC.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(isoDateTime) {
  return new Date(isoDateTime).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
