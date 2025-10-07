export const toYMD = (d) => d.toISOString().split("T")[0];

export const parseTimeOnly = (timeStr = "") => {
  if (!timeStr) return null;
  const first = timeStr.split("-")[0].trim();
  const parts = first.split(":").slice(0, 2);
  if (parts.length < 2) return null;
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};

export const minutesFromHHMM = (hhmm) => {
  const [h, m] = (hhmm || "00:00").split(":").map((n) => parseInt(n, 10));
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
};

export const parseHHMMSSToMinutes = (hhmmss = "") => {
  if (!hhmmss) return null;
  const parts = hhmmss.split(":").map((p) => parseInt(p, 10));
  if (parts.length < 2) return null;
  const h = isNaN(parts[0]) ? 0 : parts[0];
  const m = isNaN(parts[1]) ? 0 : parts[1];
  return h * 60 + m;
};

export const formatMinutesTo12h = (min) => {
  if (typeof min !== "number" || isNaN(min)) return "";
  min = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  let h = Math.floor(min / 60);
  let m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
};
