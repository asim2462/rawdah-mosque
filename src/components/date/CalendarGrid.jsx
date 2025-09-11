// src/components/date/CalendarGrid.jsx

// Build a 6x7 month grid anchored at UTC, week starts Monday.
function buildMonthMatrix(year, month /* 0-11 */) {
    const first = new Date(Date.UTC(year, month, 1));
    // Convert Sun(0)..Sat(6) -> Mon(0)..Sun(6)
    const shift = (first.getUTCDay() + 6) % 7;
    const start = new Date(Date.UTC(year, month, 1 - shift)); // Monday of first row

    const days = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + i));
        days.push(d);
    }
    return days;
}

function keyFromDateUTC(d) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

export default function CalendarGrid({
    year,
    month,                 // 0–11
    selectedKey,           // "YYYY-MM-DD" to highlight
    availableDatesSet,     // Set<string> of enabled dates (optional)
    onSelect,              // (key: string) => void
}) {
    const today = new Date();
    const todayKey = keyFromDateUTC(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())));
    const days = buildMonthMatrix(year, month);

    return (
        <div className="grid grid-cols-7 gap-1 p-2 pb-3">
            {days.map((d) => {
                const inMonth = d.getUTCMonth() === month;
                const key = keyFromDateUTC(d);
                const isSelected = key === selectedKey;
                const isToday = key === todayKey;
                const isAvailable = inMonth && (availableDatesSet ? availableDatesSet.has(key) : true);
                const disabled = !isAvailable;

                const base =
                    isSelected ? "bg-[#bf9743] text-[#0f172a]" :
                        isAvailable ? "bg-[#2b4859] text-white hover:brightness-110 cursor-pointer" :
                            "bg-white/5 text-white/40 cursor-not-allowed";

                return (
                    <button
                        key={key}
                        type="button"
                        className={`h-9 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${base}`}
                        aria-disabled={disabled}
                        title={disabled ? "Unavailable" : `Select ${key}`}
                        onClick={() => { if (!disabled) onSelect?.(key); }}
                    >
                        <span className={isToday && !isSelected ? "underline underline-offset-2" : ""}>
                            {d.getUTCDate()}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
