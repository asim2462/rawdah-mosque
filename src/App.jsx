import { useState, useEffect } from "react";
import PrayerTimes from "./components/PrayerTimes";
import Countdown from "./components/Countdown";
import Announcements from "./components/Announcements";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import { getNextPrayer, formatDateDisplay } from "./utils/prayerUtils";
import Footer from "./components/Footer";

// The root component for the prayer times app.
function App() {
  // State to track the current time (for live countdowns)
  const [now, setNow] = useState(Date.now());

  // Custom hook: fetches today's/tomorrow's prayer times and loading/error state from Supabase
  const {
    prayerTimes,
    todayObj,
    tomorrowPrayerTimes,
    loading,
    error,
  } = usePrayerTimes();

  // Responsive CSS variable to set 100vh for mobile browsers (fixes issues with mobile address bar)
  useEffect(() => {
    function setVh() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Update `now` every second to make the countdown live
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Find the next prayer based on current time
  const nextPrayer = getNextPrayer(prayerTimes, tomorrowPrayerTimes);
  return (
    <div
      className="flex flex-col min-h-screen relative bg-cover bg-center"
      style={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        backgroundImage: "url('/bg_pattern_blue.jpg')"
      }}
    >
      {/* Header: Shows the current Islamic day/month */}
      <header className="w-full py-6">
        <h1 className="text-center text-2xl sm:text-3xl md:text-5xl  text-[#ffffff] font-bold" tabIndex={0} style={{ fontFamily: 'BerlingskeSerif-Regular' }}>
          {todayObj?.islamic_day} {todayObj?.islamic_month} Prayer Times
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full px-2" id="main-content">
        {/* Show the date if we have today's data */}
        {!loading && !error && todayObj && (
        <section className="mb-2 text-center" aria-labelledby="date-label">
          <div
            id="date-label"
            className="text-lg text-[#ffffff]" style={{ fontFamily: 'avenir-next-demi-bold' }}
            tabIndex={0}
            aria-label={`Date: ${formatDateDisplay(todayObj.day, todayObj.date)}`}
          >
            {formatDateDisplay(todayObj.day, todayObj.date)}
          </div>
        </section>
        )}

        {/* Show loading indicator */}
        {loading && (
          <p className="my-8 text-lg text-gray-500" role="status">Loading…</p>
        )}

        {/* Show error if data failed to load */}
        {error && (
          <p className="my-8 text-red-600" role="alert">{error}</p>
        )}

        {/* Show "No data" if loaded but nothing for today */}
        {!loading && !error && !todayObj && (
          <p className="my-8 text-lg text-gray-500">No data for today.</p>
        )}

        {/* Show countdown and prayer times if we have data */}
        {!loading && !error && todayObj && (
          <>
            {nextPrayer && (
              <Countdown
                targetDateTime={nextPrayer.dateObj}
                label={nextPrayer.name}
                now={now}
              />
            )}
            <PrayerTimes times={prayerTimes} highlightedPrayer={nextPrayer ? nextPrayer.name : null} />
          </>
        )}

        {/* Announcements component (shows if any) */}
        <Announcements />
      </main>

      {/* Footer is now its own component */}
      <Footer />
    </div>
  );
}

export default App;
