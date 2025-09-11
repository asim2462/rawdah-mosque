// src/components/date/MobileNativeDatePicker.jsx
import { useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

/**
 * Mobile-first native date picker trigger (UI-only).
 * Emits a "YYYY-MM-DD" string via onChange.
 */
export default function MobileNativeDatePicker({
    value,
    min,
    max,
    onChange,
    title = "Pick a date",
    inputId = "native-date",
}) {
    const inputRef = useRef(null);

    const openNative = () => {
        const el = inputRef.current;
        if (!el) return;
        if (typeof el.showPicker === "function") el.showPicker();
        else el.focus();
    };

    return (
        <div className="inline-flex items-center">
            <button
                type="button"
                onClick={openNative}
                title={title}
                aria-haspopup="dialog"
                aria-controls={inputId}
                className="mr-2 inline-flex items-center justify-center w-8 h-8 cursor-pointer
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
                <CalendarIcon size={16} aria-hidden="true" />
                <span className="sr-only">{title}</span>
            </button>

            <input
                id={inputId}
                ref={inputRef}
                type="date"
                value={value || ""}
                min={min}
                max={max}
                onChange={(e) => onChange?.(e.target.value)}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
            />
        </div>
    );
}
