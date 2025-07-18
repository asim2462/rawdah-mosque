import { useEffect, useState } from "react";
import PrayerTimes from "./components/PrayerTimes";
import Countdown from "./components/Countdown";
import Papa from "papaparse";

// Replace with your real published Google Sheets CSV link:
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

function formatDateDisplay(day, dateStr) {
  // dateStr is like "18-07-2025"
  const [year, month, dayNum] = dateStr.split("-");
  return `${day} ${dayNum}-${month}-${year}`;
}

// Find the next prayer (with time > now)
function getNextPrayer(prayers) {
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
  return null; // or fallback to first prayer tomorrow if you want
}

function App() {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [todayObj, setTodayObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    fetch(SHEET_CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        const { data } = Papa.parse(csvText, { header: true });
        const todayData = data.filter(row => row.date === todayStr);
        setTodayObj(todayData[0]);
        setPrayerTimes(convertDayToPrayerArray(todayData[0]));
        setLoading(false);
      })
      .catch(err => {
        setError("Could not fetch prayer times.");
        setLoading(false);
      });
  }, [todayStr]);

  const nextPrayer = getNextPrayer(prayerTimes);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <h1 className="w-full text-center text-2xl sm:text-3xl md:text-4xl font-bold mt-8 mb-4 text-blue-600">
        Rawdah Mosque Prayer Times
      </h1>
      {loading ? (
        <p className="mt-8 text-lg text-gray-500">Loading...</p>
      ) : error ? (
        <p className="mt-8 text-red-600">{error}</p>
      ) : !todayObj ? (
        <p className="mt-8 text-lg text-gray-500">No data for today.</p>
      ) : (
        <>
        <PrayerTimes
            times={prayerTimes}
            date={formatDateDisplay(todayObj.day, todayObj.date)}
            dhul_hijjah={todayObj.dhul_hijjah}
          />
          {nextPrayer && (
            <Countdown
              targetDateTime={nextPrayer.dateObj}
              label={nextPrayer.name}
            />
          )}
          
        </>
      )}
    </div>
  );
}

export default App;
