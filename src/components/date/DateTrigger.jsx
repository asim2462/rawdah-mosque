// src/components/date/DateTrigger.jsx
import { forwardRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const DateTrigger = forwardRef(function DateTrigger(
    { isOpen = false, onClick, popoverId = "date-popover", title = "Pick a date" },
    ref
) {
    return (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={popoverId}
            title={title}
            className="mr-2 inline-flex items-center justify-center w-8 h-8 cursor-pointer
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
            <CalendarIcon size={16} aria-hidden="true" />
            <span className="sr-only">{title}</span>
        </button>
    );
});

export default DateTrigger;
