import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { MOSQUE_ID } from "../config";
import { getUKTodayString, convertDayToPrayerArray } from "../utils/prayerUtils";

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [todayObj, setTodayObj] = useState(null);
  const [tomorrowObj, setTomorrowObj] = useState(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const todayStr = getUKTodayString();

  useEffect(() => {
    setLoading(true);
    setError("");
    async function fetchData() {
      try {
        // Fetch today's and tomorrow's rows in one query
        const today = todayStr;
        const tomorrowDate = new Date(today);
        const [year, month, day] = today.split("-");
        tomorrowDate.setDate(Number(day) + 1);
        const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("prayer_times")
          .select("*")
          .eq("mosque_id", MOSQUE_ID)
          .in("date", [today, tomorrowStr]);

        if (error) throw error;

        const todayData = data.find(row => row.date === today);
        const tomorrowData = data.find(row => row.date === tomorrowStr);

        setTodayObj(todayData);
        setPrayerTimes(convertDayToPrayerArray(todayData));
        setTomorrowObj(tomorrowData);
        setTomorrowPrayerTimes(convertDayToPrayerArray(tomorrowData));
        setLoading(false);
      } catch (err) {
        setError("Could not fetch prayer times. Make sure you are connected to the internet.");
        setLoading(false);
      }
    }
    fetchData();
  }, [todayStr]);

  return {
    prayerTimes,
    todayObj,
    tomorrowObj,
    tomorrowPrayerTimes,
    loading,
    error,
  };
}
