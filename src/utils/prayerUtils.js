// src/utils/prayerUtils.js

// Get today's date string in UK time (YYYY-MM-DD)
export function getUKTodayString() {
  const now = new Date();
  const ukDateParts = now.toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/");
  return `${ukDateParts[2]}-${ukDateParts[1]}-${ukDateParts[0]}`;
}

// Helper to format time as HH:MM
export function formatTime(t) {
  if (!t) return "";
  if (t.length === 5) return t; // already HH:MM
  const parts = t.split(":");
  return `${parts[0]}:${parts[1]}`;
}

export function convertDayToPrayerArray(dayObj) {
  if (!dayObj) return [];
  return [
    { name: "Fajr", time: formatTime(dayObj.fajr_start), jamaat: formatTime(dayObj.fajr_jamaat) },
    { name: "Sunrise", time: formatTime(dayObj.sunrise), jamaat: "" },
    { name: "Dhuhr", time: formatTime(dayObj.dhuhr_start), jamaat: formatTime(dayObj.dhuhr_jamaat) },
    { name: "'Asr", time: formatTime(dayObj.asr_start), jamaat: formatTime(dayObj.asr_jamaat) },
    { name: "Maghrib", time: formatTime(dayObj.maghrib_start), jamaat: formatTime(dayObj.maghrib_jamaat) },
    { name: "'Isha", time: formatTime(dayObj.isha_start), jamaat: formatTime(dayObj.isha_jamaat) },
  ];
}

// Find next prayer time; if all passed, use tomorrow's Fajr
export function getNextPrayer(prayers, tomorrowPrayers) {
  if (!prayers || prayers.length === 0) return null;
  const now = new Date();
  for (let i = 0; i < prayers.length; i++) {
    if (!prayers[i].time) continue;
    const [hour, minute] = prayers[i].time.split(":").map(Number);
    const prayerTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
    if (prayerTime > now) {
      return { ...prayers[i], dateObj: prayerTime };
    }
  }
  // All prayers have passed: return tomorrow's Fajr
  if (tomorrowPrayers && tomorrowPrayers.length > 0 && tomorrowPrayers[0].time) {
    const [hour, minute] = tomorrowPrayers[0].time.split(":").map(Number);
    const fajrTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      hour,
      minute
    );
    return { ...tomorrowPrayers[0], dateObj: fajrTime };
  }
  return null;
}

// Format date for display (e.g. "Friday 19-07-2025")
export function formatDateDisplay(day, dateStr) {
  if (!dateStr) return "";
  const weekday =
    day ||
    new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' });
  const [year, month, dayNum] = dateStr.split("-");
  return `${weekday} ${dayNum}-${month}-${year}`;
}

/* ---------------- New helpers for your header date ---------------- */

// Parse "YYYY-MM-DD" or "DD-MM-YYYY" or "DD/MM/YYYY" (and Date) anchored at UTC midnight
function parseDateFlexible(input) {
  if (!input) return null;

  if (input instanceof Date) {
    return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  }

  const s = String(input).slice(0, 10); // ignore any time suffix
  // normalise separators to "-"
  const norm = s.replaceAll("/", "-");

  // YYYY-MM-DD
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(norm);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));

  // DD-MM-YYYY
  m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(norm);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));

  // Fallback: let Date try
  const d = new Date(norm);
  return isNaN(d) ? null : new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// "YYYY-MM-DD" / "DD-MM-YYYY" / "DD/MM/YYYY" -> "11 September"
export function formatGregorianShort(isoOrDmy, locale = "en-GB") {
  const d = parseDateFlexible(isoOrDmy);
  if (!d) return String(isoOrDmy || "");
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(d);
}

// Weekday from the same date -> "Thursday"
export function formatWeekdayLong(isoOrDmy, locale = "en-GB") {
  const d = parseDateFlexible(isoOrDmy);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "Europe/London",
  }).format(d);
}
