// src/components/date/DatePopover.jsx
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarGrid from "./CalendarGrid.jsx";
import { fetchAvailableDateKeysInMonth, fetchMinMaxDateKeys } from "../../hooks/usePrayerTimes";

/**
 * Centered modal calendar (all breakpoints).
 * - Backdrop blur + fade (300ms)
 * - Panel fade/scale in (300ms)
 * - Esc to close; click/touch outside to close
 * - Locks page scroll while open
 * - Month navigation (‹/›) + availability loading for displayed month
 * - Min/Max guardrails based on actual data for the configured mosque
 */
export default function DatePopover({
    isOpen,
    onClose,
    label = "Choose a date",
    anchorDateKey,           // "YYYY-MM-DD" month to initialise display
    selectedDateKey,         // "YYYY-MM-DD" highlight (if in displayed month)
    onSelectDate,            // (key: string) => void
}) {
    const [ready, setReady] = useState(false);
    const [displayYear, setDisplayYear] = useState(() => new Date().getFullYear());
    const [displayMonth, setDisplayMonth] = useState(() => new Date().getMonth()); // 0–11
    const [availSet, setAvailSet] = useState(undefined); // Set<string YYYY-MM-DD> | undefined
    const [loadingAvail, setLoadingAvail] = useState(false);

    const [minKey, setMinKey] = useState(null); // "YYYY-MM-DD"
    const [maxKey, setMaxKey] = useState(null); // "YYYY-MM-DD"

    const ymIndex = (y, m) => y * 12 + m; // numeric month index for easy compare
    const parseYM = (key) => {
        if (!key) return null;
        const [yy, mm] = key.split("-").map(Number);
        return { y: yy, m: mm - 1 };
    };

    // Initialise displayed year/month from anchor when opened or anchor changes
    useEffect(() => {
        if (!isOpen) return;
        if (anchorDateKey && /^\d{4}-\d{2}-\d{2}$/.test(anchorDateKey)) {
            const [yy, mm] = anchorDateKey.split("-").map(Number);
            setDisplayYear(yy);
            setDisplayMonth(mm - 1);
        } else {
            const d = new Date();
            setDisplayYear(d.getFullYear());
            setDisplayMonth(d.getMonth());
        }
    }, [isOpen, anchorDateKey]);

    // Esc to close + lock/unlock page scroll + gentle enter animation
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        document.addEventListener("keydown", onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const id = setTimeout(() => setReady(true), 0);

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            clearTimeout(id);
            setReady(false);
        };
    }, [isOpen, onClose]);

    // Load min/max once per open
    useEffect(() => {
        let cancelled = false;
        async function loadMinMax() {
            const res = await fetchMinMaxDateKeys();
            if (!cancelled && res) {
                setMinKey(res.min);
                setMaxKey(res.max);
            }
        }
        if (isOpen) loadMinMax();
        return () => { cancelled = true; };
    }, [isOpen]);

    // Clamp anchor to bounds once min/max known
    useEffect(() => {
        if (!isOpen || !minKey || !maxKey) return;
        const min = parseYM(minKey);
        const max = parseYM(maxKey);
        if (!min || !max) return;

        const cur = { y: displayYear, m: displayMonth };
        const curIdx = ymIndex(cur.y, cur.m);
        const minIdx = ymIndex(min.y, min.m);
        const maxIdx = ymIndex(max.y, max.m);

        if (curIdx < minIdx) { setDisplayYear(min.y); setDisplayMonth(min.m); }
        else if (curIdx > maxIdx) { setDisplayYear(max.y); setDisplayMonth(max.m); }
    }, [isOpen, minKey, maxKey, displayYear, displayMonth]);

    // Load availability for the displayed month
    useEffect(() => {
        let cancelled = false;
        async function loadAvail() {
            setLoadingAvail(true);
            const set = await fetchAvailableDateKeysInMonth(displayYear, displayMonth + 1);
            if (!cancelled) {
                setAvailSet(set);      // if fetch fails, set stays undefined → all days enabled gracefully
                setLoadingAvail(false);
            }
        }
        if (isOpen) loadAvail();
        return () => { cancelled = true; };
    }, [isOpen, displayYear, displayMonth]);

    // Compute nav disabled states
    const prevDisabled = useMemo(() => {
        if (!minKey) return false; // unknown -> allow
        const min = parseYM(minKey);
        return ymIndex(displayYear, displayMonth) <= ymIndex(min.y, min.m);
    }, [minKey, displayYear, displayMonth]);

    const nextDisabled = useMemo(() => {
        if (!maxKey) return false;
        const max = parseYM(maxKey);
        return ymIndex(displayYear, displayMonth) >= ymIndex(max.y, max.m);
    }, [maxKey, displayYear, displayMonth]);

    // Month navigation
    const goPrev = () => {
        if (prevDisabled) return;
        const m = displayMonth - 1;
        if (m < 0) { setDisplayYear((y) => y - 1); setDisplayMonth(11); }
        else { setDisplayMonth(m); }
    };
    const goNext = () => {
        if (nextDisabled) return;
        const m = displayMonth + 1;
        if (m > 11) { setDisplayYear((y) => y + 1); setDisplayMonth(0); }
        else { setDisplayMonth(m); }
    };

    // Label for header
    const monthLabel = useMemo(() => {
        return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" })
            .format(new Date(Date.UTC(displayYear, displayMonth, 1)));
    }, [displayYear, displayMonth]);

    if (!isOpen) return null;

    return (
        // Overlay handles backdrop + outside-close
        <div
            className={`fixed inset-0 z-[120] flex items-center justify-center p-4
                  bg-black/40 backdrop-blur-sm
                  transition-opacity duration-300 ease-out
                  ${ready ? "opacity-100" : "opacity-0"}`}
            onClick={onClose}
            onTouchStart={onClose}
            aria-hidden={false}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={label}
                className={`w-80 rounded-2xl border border-white/10 bg-[#013C54] text-white shadow-2xl
                    transition-all duration-300 ease-out
                    ${ready ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
                // Prevent inner clicks/touches from closing
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <button
                        type="button"
                        className={`p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                        ${prevDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                        onClick={goPrev}
                        title="Previous month"
                        aria-label="Previous month"
                        disabled={prevDisabled}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="text-sm font-semibold inline-flex items-center gap-2">
                        {monthLabel}
                        {loadingAvail && <span className="text-white/70 text-[11px]">Loading…</span>}
                    </div>

                    <button
                        type="button"
                        className={`p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                        ${nextDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                        onClick={goNext}
                        title="Next month"
                        aria-label="Next month"
                        disabled={nextDisabled}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Weekday headings */}
                <div className="grid grid-cols-7 gap-0 px-2 pt-2 text-xs text-white/70">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div key={d} className="text-center py-1">{d}</div>
                    ))}
                </div>

                {/* Month grid */}
                <CalendarGrid
                    year={displayYear}
                    month={displayMonth}
                    selectedKey={selectedDateKey}
                    availableDatesSet={availSet}
                    onSelect={onSelectDate}
                />

                {/* Footer */}
                <div className="flex items-center justify-end px-3 py-2 border-t border-white/10 text-[11px] text-white/70">
                    <button
                        type="button"
                        className="underline hover:opacity-80 cursor-pointer
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
