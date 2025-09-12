import { motion } from "framer-motion";
import { Megaphone, Settings as SettingsIcon } from "lucide-react";
import { tabPillSpring } from "../common/motionPresets";

/**
 * TabBar
 * Props:
 *  - value: "announcements" | "settings"
 *  - onChange: (key) => void
 *  - iconsOnly?: boolean (default false)
 *  - className?: string
 *
 * Icon-only mode is used in the Drawer header. The container is a fixed 40px tall
 * (h-10) with p-1.5, and each tab fills the available height for a uniform look with the Close (X).
 */
export default function TabBar({ value, onChange, iconsOnly = false, className = "" }) {
    const tabs = [
        { key: "announcements", label: "Announcements", icon: Megaphone },
        { key: "settings", label: "Settings", icon: SettingsIcon },
    ];

    const baseContainer = iconsOnly
        ? "rounded-xl bg-white/5 p-1.5 flex items-center gap-1 w-full h-10"
        : "rounded-xl bg-white/5 p-1.5 flex items-center gap-1";
    const containerClasses = [baseContainer, className].join(" ").trim();

    return (
        <div role="tablist" aria-label="Drawer sections" className={containerClasses}>
            {tabs.map((t) => {
                const Icon = t.icon;
                const active = value === t.key;

                if (iconsOnly) {
                    // Equal-width, full-height icon buttons
                    return (
                        <button
                            key={t.key}
                            role="tab"
                            aria-selected={active}
                            aria-label={t.label}
                            onClick={() => onChange(t.key)}
                            className={[
                                "relative h-full w-full flex-1 grid place-items-center",
                                "rounded-xl text-sm font-medium transition cursor-pointer",
                                active ? "text-slate-900" : "text-white/80 hover:text-white",
                            ].join(" ")}
                        >
                            {active && (
                                <motion.span
                                    layoutId="tab-bg"
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-xl"
                                    style={{ background: "#bf9743" }}  // gold highlight
                                    transition={tabPillSpring}
                                />
                            )}
                            <span className="relative z-10">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="sr-only">{t.label}</span>
                        </button>
                    );
                }

                // (Not used in the Drawer) default icon+text mode, radius kept uniform
                return (
                    <button
                        key={t.key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(t.key)}
                        className={[
                            "relative flex-1 min-w-0 inline-flex items-center justify-center gap-2",
                            "rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer",
                            active ? "text-slate-900" : "text-white/80 hover:text-white",
                        ].join(" ")}
                    >
                        {active && (
                            <motion.span
                                layoutId="tab-bg"
                                aria-hidden="true"
                                className="absolute inset-0 rounded-xl"
                                style={{ background: "#bf9743" }}   // gold highlight
                                transition={tabPillSpring}
                            />
                        )}
                        <span className="relative z-10 inline-flex items-center gap-2">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            {t.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
