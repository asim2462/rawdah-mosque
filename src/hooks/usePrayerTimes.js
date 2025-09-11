// src/hooks/usePrayerTimes.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import * as cfg from "../config";
import { getUKTodayString, convertDayToPrayerArray } from "../utils/prayerUtils";

/* ----------------------------- date helpers ----------------------------- */
function mkKey(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function nextDayKeyFrom(key) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return mkKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/* ----------------------------- AVAIL caching ---------------------------- */
// Cache month availability by "YYYY-MM" -> { set: Set<string>, ts: number }
const AVAIL_CACHE = new Map();
const AVAIL_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Cache min/max once per session (or until TTL)
let MINMAX_CACHE = null; // { min, max, ts }
const MINMAX_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function clearPrayerTimesCache() {
  AVAIL_CACHE.clear();
  MINMAX_CACHE = null;
}

/* ------------------------------ main hook ------------------------------- */
/**
 * usePrayerTimes(forDateKey?)
 * - forDateKey undefined/null → "today mode": loads today + tomorrow (for countdown)
 * - forDateKey "YYYY-MM-DD"   → "preview mode": loads only that day; no tomorrow fetch
 * NOTE: In your App we call usePrayerTimes() for today, and usePrayerTimesByDate() for previews.
 */
export function usePrayerTimes(forDateKey = null) {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [todayObj, setTodayObj] = useState(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDay(key) {
      let q = supabase.from("prayer_times").select("*").eq("date", key);
      // Filter by configured mosque
      if (cfg.MOSQUE_ID != null) q = q.eq("mosque_id", cfg.MOSQUE_ID);
      else if (cfg.MOSQUE_SLUG != null) q = q.eq("mosque", cfg.MOSQUE_SLUG);

      const { data, error } = await q.single();
      if (cancelled) return { data: null, error: null }; // swallow cancellations
      if (error) return { data: null, error: error.message || "Failed to load prayer times." };
      return { data, error: null };
    }

    async function run() {
      setLoading(true);
      setError(null);

      const key = forDateKey || getUKTodayString();

      // 1) Requested day
      const dayRes = await fetchDay(key);
      if (cancelled) return;
      if (dayRes.error) {
        setTodayObj(null);
        setPrayerTimes([]);
        setTomorrowPrayerTimes(null);
        setLoading(false);
        setError(dayRes.error);
        return;
      }

      setTodayObj(dayRes.data);
      setPrayerTimes(convertDayToPrayerArray(dayRes.data));

      // 2) Tomorrow only in "today mode"
      if (!forDateKey) {
        const tKey = nextDayKeyFrom(key);
        const tRes = await fetchDay(tKey);
        if (!cancelled && !tRes.error && tRes.data) {
          setTomorrowPrayerTimes(convertDayToPrayerArray(tRes.data));
        } else if (!cancelled) {
          setTomorrowPrayerTimes(null);
        }
      } else if (!cancelled) {
        setTomorrowPrayerTimes(null);
      }

      if (!cancelled) setLoading(false);
    }

    run();
    return () => { cancelled = true; };
  }, [forDateKey]);

  return { prayerTimes, todayObj, tomorrowPrayerTimes, loading, error };
}

/* --------- preview-only hook: fetches only when a dateKey is provided -------- */
export function usePrayerTimesByDate(dateKey) {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [dayObj, setDayObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDay(key) {
      let q = supabase.from("prayer_times").select("*").eq("date", key);
      if (cfg.MOSQUE_ID != null) q = q.eq("mosque_id", cfg.MOSQUE_ID);
      else if (cfg.MOSQUE_SLUG != null) q = q.eq("mosque", cfg.MOSQUE_SLUG);

      const { data, error } = await q.single();
      if (cancelled) return { data: null, error: null };
      if (error) return { data: null, error: error.message || "Failed to load prayer times." };
      return { data, error: null };
    }

    async function run() {
      if (!dateKey) {
        setLoading(false);
        setError(null);
        setDayObj(null);
        setPrayerTimes([]);
        return;
      }

      setLoading(true);
      setError(null);

      const res = await fetchDay(dateKey);
      if (cancelled) return;

      if (res.error) {
        setDayObj(null);
        setPrayerTimes([]);
        setError(res.error);
      } else {
        setDayObj(res.data);
        setPrayerTimes(convertDayToPrayerArray(res.data));
      }

      setLoading(false);
    }

    run();
    return () => { cancelled = true; };
  }, [dateKey]);

  return { prayerTimes, dayObj, loading, error };
}

/* --------------------- month availability (cached) ---------------------- */
/**
 * Fetch available date keys for a specific month for the configured mosque.
 * Returns a Set of "YYYY-MM-DD" strings. If it fails, returns undefined (graceful fallback).
 */
export async function fetchAvailableDateKeysInMonth(year, month /* 1-12 */) {
  const ymKey = `${year}-${String(month).padStart(2, "0")}`;
  const now = Date.now();

  // Serve fresh cache if present
  const cached = AVAIL_CACHE.get(ymKey);
  if (cached && now - cached.ts < AVAIL_TTL_MS) {
    return cached.set;
  }

  try {
    const start = mkKey(year, month, 1);
    const endDate = new Date(Date.UTC(year, month, 0)).getUTCDate(); // day 0 of next month = last day of this month
    const end = mkKey(year, month, endDate);

    let q = supabase.from("prayer_times").select("date").gte("date", start).lte("date", end);
    if (cfg.MOSQUE_ID != null) q = q.eq("mosque_id", cfg.MOSQUE_ID);
    else if (cfg.MOSQUE_SLUG != null) q = q.eq("mosque", cfg.MOSQUE_SLUG);

    const { data, error } = await q;
    if (error) {
      // On error, fall back to stale cache if available
      if (cached) return cached.set;
      return undefined;
    }

    const set = new Set();
    for (const row of data || []) {
      if (row?.date) set.add(row.date.slice(0, 10));
    }
    // Update cache
    AVAIL_CACHE.set(ymKey, { set, ts: now });
    return set;
  } catch {
    if (cached) return cached.set;
    return undefined;
  }
}

/* ------------------------ min/max date (cached) ------------------------- */
/**
 * Fetch the earliest and latest dates for the configured mosque.
 * Returns { min: "YYYY-MM-DD", max: "YYYY-MM-DD" } or null if it fails.
 */
export async function fetchMinMaxDateKeys() {
  const now = Date.now();
  if (MINMAX_CACHE && now - MINMAX_CACHE.ts < MINMAX_TTL_MS) {
    const { min, max } = MINMAX_CACHE;
    return { min, max };
  }

  try {
    // earliest
    let q1 = supabase.from("prayer_times").select("date").order("date", { ascending: true }).limit(1);
    if (cfg.MOSQUE_ID != null) q1 = q1.eq("mosque_id", cfg.MOSQUE_ID);
    else if (cfg.MOSQUE_SLUG != null) q1 = q1.eq("mosque", cfg.MOSQUE_SLUG);
    const { data: d1, error: e1 } = await q1;

    // latest
    let q2 = supabase.from("prayer_times").select("date").order("date", { ascending: false }).limit(1);
    if (cfg.MOSQUE_ID != null) q2 = q2.eq("mosque_id", cfg.MOSQUE_ID);
    else if (cfg.MOSQUE_SLUG != null) q2 = q2.eq("mosque", cfg.MOSQUE_SLUG);
    const { data: d2, error: e2 } = await q2;

    if (e1 || e2) return null;

    const min = d1?.[0]?.date?.slice(0, 10) || null;
    const max = d2?.[0]?.date?.slice(0, 10) || null;
    if (!min || !max) return null;

    MINMAX_CACHE = { min, max, ts: now };
    return { min, max };
  } catch {
    return null;
  }
}
