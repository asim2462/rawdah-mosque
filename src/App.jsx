import { useState, useEffect } from "react";
import PrayerTimes from "./components/PrayerTimes";
import Countdown from "./components/Countdown";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import { getNextPrayer, formatGregorianShort, formatWeekdayLong, getUKTodayString } from "./utils/prayerUtils";
import Footer from "./components/Footer";
import HeaderDate from "./components/date/HeaderDate.jsx";
import PreviewBanner from "./components/date/PreviewBanner.jsx";

// The root component for the prayer times app.
function App() {
  const [now, setNow] = useState(Date.now());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  // 1) Today's/tomorrow's (existing behaviour)
  const {
    prayerTimes: todayTimes,
    todayObj: todayObjReal,
    tomorrowPrayerTimes,
    loading: loadingToday,
    error: errorToday,
  } = usePrayerTimes(); // no arg -> today mode

  // Default selection to today when it arrives
  useEffect(() => {
    if (todayObjReal?.date && !selectedDateKey) {
      setSelectedDateKey(todayObjReal.date);
    }
  }, [todayObjReal?.date, selectedDateKey]);

  // 2) Preview mode: fetch only when selected date differs from real today
  const isPreviewing =
    !!(todayObjReal?.date && selectedDateKey && selectedDateKey !== todayObjReal.date);

  const {
    prayerTimes: previewTimes,
    todayObj: previewObj,
    loading: loadingPreview,
    error: errorPreview,
  } = usePrayerTimes(isPreviewing ? selectedDateKey : null); // pass the date only when previewing

  // Header shows the selected date (today or preview)
  const headerKey = selectedDateKey || todayObjReal?.date || getUKTodayString();
  const weekdayText = headerKey ? formatWeekdayLong(headerKey) : "";
  const dateText = headerKey ? formatGregorianShort(headerKey) : "";

  // ✅ Islamic header switches with preview
  const islamicHeaderDay = isPreviewing ? previewObj?.islamic_day : todayObjReal?.islamic_day;
  const islamicHeaderMonth = isPreviewing ? previewObj?.islamic_month : todayObjReal?.islamic_month;

  // Countdown only for *real today*
  const nextPrayer = getNextPrayer(todayTimes, tomorrowPrayerTimes);
  const showCountdown = !isPreviewing && !!nextPrayer;

  // Decide which times to render
  const timesToRender = isPreviewing ? previewTimes : todayTimes;
  const loading = isPreviewing ? loadingPreview : loadingToday;
  const error = isPreviewing ? errorPreview : errorToday;

  // VH fix
  useEffect(() => {
    function setVh() {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    }
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Live now for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Popover controls
  const openDatePicker = () => setIsDatePickerOpen(true);
  const closeDatePicker = () => setIsDatePickerOpen(false);

  // Select date (from the custom calendar)
  const handleSelectDateKey = (key) => {
    setSelectedDateKey(key);
    setIsDatePickerOpen(false);
  };

  // Back to today
  const handleBackToToday = () => {
    if (todayObjReal?.date) setSelectedDateKey(todayObjReal.date);
  };

  return (
    <div
      className="flex flex-col min-h-screen relative bg-cover bg-center"
      style={{
        minHeight: "calc(var(--vh, 1vh) * 100)",
        backgroundImage: "url('/bg_pattern_blue.jpg')",
      }}
    >
      {/* Header: Islamic day/month (updates when previewing) */}
      <header className="w-full py-6">
        <h1
          className="text-center text-2xl sm:text-3xl md:text-5xl  text-[#ffffff] font-bold"
          tabIndex={0}
          style={{ fontFamily: "BerlingskeSerif-Regular" }}
        >
          {islamicHeaderDay} {islamicHeaderMonth} Prayer Times
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full px-2" id="main-content">
        {/* Date line with centered modal calendar */}
        {!loadingToday && !errorToday && (todayObjReal || selectedDateKey) && (
          <>
            <HeaderDate
              weekdayText={weekdayText}
              dateText={dateText}
              // Modal controls
              isDatePickerOpen={isDatePickerOpen}
              onOpenDatePicker={openDatePicker}
              onCloseDatePicker={closeDatePicker}
              // Selection
              currentDateValue={headerKey}
              selectedDateKey={selectedDateKey || todayObjReal?.date}
              onSelectDateKey={handleSelectDateKey}
            />

            {/* Preview banner */}
            <PreviewBanner active={isPreviewing} onBack={handleBackToToday} />
          </>
        )}

        {/* Loading / error / empty for whichever times we're showing */}
        {loading && <p className="my-8 text-lg text-gray-300" role="status">Loading…</p>}
        {error && <p className="my-8 text-red-400" role="alert">{error}</p>}
        {!loading && !error && !timesToRender?.length && (
          <p className="my-8 text-lg text-gray-300">No prayer times for this date.</p>
        )}

        {/* Countdown + table */}
        {!loading && !error && timesToRender?.length > 0 && (
          <>
            {showCountdown && (
              <Countdown targetDateTime={nextPrayer.dateObj} label={nextPrayer.name} now={now} />
            )}
            <PrayerTimes
              times={timesToRender}
              highlightedPrayer={showCountdown ? nextPrayer.name : null}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
