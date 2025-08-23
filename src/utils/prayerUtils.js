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

