import { useEffect, useState } from "react";
import PrayerTimes from "./components/PrayerTimes";
import Countdown from "./components/Countdown";
import Papa from "papaparse";

// Replace with your actual published Google Sheets CSV link:
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRU7YWb2LM-bBj8Fnd1frBmLI9cqk52XknydDWbIHzpOed4Fg7EMgiu_QSaP5cqWkpjFnDKgXCI0dX0/pub?gid=0&single=true&output=csv";

function convertDayToPrayerArray(dayObj) {
  if (!dayObj) return [];
  return [
    { name: "Fajr", time: dayObj.fajr_start, iqamah: dayObj.fajr_jamaat },
    { name: "Dhuhr", time: dayObj.dhuhr_start, iqamah: dayObj.dhuhr_jamaat },
    { name: "Asr", time: dayObj.asr_start, iqamah: dayObj.asr_jamaat },
    { name: "Maghrib", time: dayObj.maghrib_start, iqamah: dayObj.maghrib_jamaat },
    { name: "Isha", time: dayObj.isha_start, iqamah: dayObj.isha_jamaat }
  ];
}

function getNextPrayer(prayers, tomorrowPrayers) {
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
  // If all have passed, return tomorrow's Fajr
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

function formatDateDisplay(day, dateStr) {
  if (!dateStr || !day) return "";
  const [year, month, dayNum] = dateStr.split("-");
  return `${day} ${dayNum}-${month}-${year}`;
}

function App() {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [todayObj, setTodayObj] = useState(null);
  const [tomorrowObj, setTomorrowObj] = useState(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    fetch(SHEET_CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        const { data } = Papa.parse(csvText, { header: true });

        const todayData = data.filter(row => row.date === todayStr);
        setTodayObj(todayData[0]);
        setPrayerTimes(convertDayToPrayerArray(todayData[0]));

        // Tomorrow's data
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        const tomorrowData = data.filter(row => row.date === tomorrowStr);
        setTomorrowObj(tomorrowData[0]);
        setTomorrowPrayerTimes(convertDayToPrayerArray(tomorrowData[0]));

        setLoading(false);
      })
      .catch(err => {
        setError("Could not fetch prayer times.");
        setLoading(false);
      });
  }, [todayStr]);

  const nextPrayer = getNextPrayer(prayerTimes, tomorrowPrayerTimes);

  return (
    <div
      className="flex flex-col bg-slate-100"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Accessible Site Header */}
      <header className="w-full py-6">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700" tabIndex={0}>
          Rawdah Mosque Prayer Times
        </h1>
      </header>

      {/* Main Content Landmark */}
      <main className="flex-1 flex flex-col items-center w-full px-2" id="main-content">
        {/* Date and Islamic Month */}
        {!loading && !error && todayObj && (
          <section className="mb-2 text-center" aria-labelledby="date-label">
            <div
              id="date-label"
              className="font-bold text-lg"
              tabIndex={0}
              aria-label={`Date: ${formatDateDisplay(todayObj.day, todayObj.date)}`}
            >
              {formatDateDisplay(todayObj.day, todayObj.date)}
            </div>
            {todayObj.islamic_month && todayObj.islamic_day && (
              <div
                className="text-sm text-gray-500"
                tabIndex={0}
                aria-label={`Islamic Month: ${todayObj.islamic_day} ${todayObj.islamic_month} `}
              >
                {todayObj.islamic_day} {todayObj.islamic_month}
              </div>
            )}
          </section>
        )}

        {/* Error and Loading States */}
        {loading && (
          <p className="my-8 text-lg text-gray-500" role="status">Loading…</p>
        )}
        {error && (
          <p className="my-8 text-red-600" role="alert">{error}</p>
        )}
        {!loading && !error && !todayObj && (
          <p className="my-8 text-lg text-gray-500">No data for today.</p>
        )}

        {/* Main App Content */}
        {!loading && !error && todayObj && (
          <>
            {nextPrayer && (
              <Countdown
                targetDateTime={nextPrayer.dateObj}
                label={nextPrayer.name}
              />
            )}
            <PrayerTimes times={prayerTimes} />
          </>
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="w-full flex justify-center bg-slate-100 py-2 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500 max-w-xl" tabIndex={0}>
          This is an <span className="font-semibold">unofficial prayer times app</span> for the Rawdah Mosque.
          It is <span className="font-semibold">not affiliated</span> with Greensville Trust/Rawdah Mosque.
        </p>
      </footer>
    </div>
  );

}

export default App;
