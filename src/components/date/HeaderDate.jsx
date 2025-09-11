// src/components/date/HeaderDate.jsx
import { useRef, useCallback } from "react";
import DateTrigger from "./DateTrigger.jsx";
import DatePopover from "./DatePopover.jsx";

export default function HeaderDate({
    weekdayText,
    dateText,
    // Popover controls (shared for desktop & mobile)
    onOpenDatePicker,
    onCloseDatePicker,
    isDatePickerOpen = false,
    // Selection
    currentDateValue,   // "YYYY-MM-DD" month anchor for the popover
    selectedDateKey,    // "YYYY-MM-DD" highlighted day
    onSelectDateKey,    // (key: string) => void
}) {
    const triggerRef = useRef(null);

    // Blur trigger when closing (Esc/backdrop)
    const handleClose = useCallback(() => {
        if (triggerRef.current) triggerRef.current.blur();
        onCloseDatePicker?.();
    }, [onCloseDatePicker]);

    return (
        <section className="mb-2 text-center" aria-labelledby="date-label">
            <div
                id="date-label"
                className="relative inline-flex items-center justify-center text-lg text-[#ffffff]"
                style={{ fontFamily: "avenir-next-demi-bold" }}
            >
                {/* Trigger */}
                <span className="inline-flex relative">
                    <DateTrigger
                        ref={triggerRef}
                        isOpen={isDatePickerOpen}
                        onClick={onOpenDatePicker}
                        popoverId="date-popover"
                    />
                </span>

                {/* Date text */}
                {weekdayText} {dateText}

                {/* Centered modal popover */}
                <DatePopover
                    isOpen={isDatePickerOpen}
                    onClose={handleClose}
                    anchorDateKey={currentDateValue}
                    selectedDateKey={selectedDateKey}
                    onSelectDate={onSelectDateKey}
                />
            </div>
        </section>
    );
}
