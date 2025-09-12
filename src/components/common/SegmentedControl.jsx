import { motion } from "framer-motion";
import { segPillSpring } from "./motionPresets";

/**
 * SegmentedControl — 24H / 12H toggle
 * - Rounding matches Drawer header controls: rounded-xl everywhere
 * - Dark-blue base prevents green tint on cards
 * - Light-blue overlay (bg-white/5) with p-1.5 to match TabBar padding
 * - Gold animated highlight
 */
export default function SegmentedControl({
    value,
    options,
    onChange,
    layoutId = "seg-indicator",
}) {
    return (
        // Dark-blue base to avoid parent tint; rounded-xl to match header controls
        <div className="inline-block rounded-xl bg-[#013C54]">
            {/* Light-blue overlay; same padding as TabBar; rounded-xl */}
            <div className="relative rounded-xl bg-white/5 p-1.5 text-xs">
                <div
                    className="grid"
                    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
                >
                    {options.map((opt) => {
                        const active = value === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange(opt.value)}
                                className={[
                                    "relative z-10 rounded-xl px-3 py-1.5 font-semibold transition cursor-pointer",
                                    active ? "text-slate-900" : "text-white/85 hover:text-white",
                                ].join(" ")}
                            >
                                {active && (
                                    <motion.span
                                        layoutId={layoutId}
                                        className="absolute inset-0 -z-10 rounded-xl"
                                        style={{ background: "#bf9743" }} // gold highlight
                                        transition={segPillSpring}
                                    />
                                )}
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
