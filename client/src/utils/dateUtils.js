/**
 * Format a Date object or timestamp into a local ISO string (YYYY-MM-DDTHH:mm)
 * suitable for HTML5 <input type="datetime-local">.
 * Corrects for browser timezone offset so values do not shift into UTC / past time.
 */
export const toLocalISOString = (date = new Date()) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

/**
 * Safely parse a local datetime string (e.g. from input type="datetime-local")
 * into a standard ISO 8601 UTC string for backend API payloads.
 */
export const toApiISOString = (localDateTimeStr) => {
  if (!localDateTimeStr) return new Date().toISOString();
  return new Date(localDateTimeStr).toISOString();
};
