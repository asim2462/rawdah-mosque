import { useTimeFormat } from "../../context/TimeFormatContext.jsx";
import SegmentedControl from "../common/SegmentedControl.jsx";

/**
 * SettingsPanel — currently holds the Time Format card.
 * - Green card background (#56853c) to match the design
 * - 24H/12H segmented control matches tabs (light-blue bg, gold pill, rounded-xl)
 * - No "Display" heading (as requested)
 */
export default function SettingsPanel() {
    const { format, setFormat } = useTimeFormat(); // "24h" | "12h"

    return (
        <section className="rounded-2xl bg-[#56853c] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-white">Time format</p>
                    <p className="text-xs text-white/90">Choose how prayer times are shown</p>
                </div>
                <SegmentedControl
                    value={format}
                    options={[
                        { label: "24H", value: "24h" },
                        { label: "12H", value: "12h" },
                    ]}
                    onChange={setFormat}
                />
            </div>
        </section>
    );
}
