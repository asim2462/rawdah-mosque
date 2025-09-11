import { useEffect, useRef } from "react";
import { useTimeFormat } from "../../context/TimeFormatContext.jsx";

function SegmentedTimeToggle({ value, onChange, id = "time-format" }) {
  const options = [
    { id: "24h", label: "24 HR" },
    { id: "12h", label: "12 HR" },
  ];

  const GOLD = "#bf9743";
  const LIGHT_BLUE = "#2b4859";

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      className="inline-flex items-stretch rounded-xl overflow-hidden"
    >
      <span id={`${id}-label`} className="sr-only">Time format</span>

      {options.map((opt, i) => {
        const selected = value === opt.id;

        const commonClasses = [
          "relative",
          "px-4 h-11",
          "text-sm font-medium",
          "inline-flex items-center justify-center select-none",
          "cursor-pointer transition",
          i === 0 ? "rounded-l-xl" : "",
          i === options.length - 1 ? "rounded-r-xl" : "",
          // overlap by 1px to avoid any hairline seam
          i !== 0 ? "-ml-px" : "",
        ].join(" ");

        return (
          <label
            key={opt.id}
            className={commonClasses}
            style={{
              backgroundColor: selected ? GOLD : LIGHT_BLUE,
              color: selected ? "#0f172a" : undefined,
            }}
            title={`Switch to ${opt.label}`}
          >
            <input
              type="radio"
              name={id}
              value={opt.id}
              className="sr-only"
              checked={selected}
              onChange={() => onChange(opt.id)}
            />
            <span className={selected ? "font-semibold" : "text-white/90 hover:brightness-110"}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default function SettingsDrawer({ open, onClose, title = "Settings" }) {
  const closeBtnRef = useRef(null);
  const { format, setFormat } = useTimeFormat();

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus the close button when opened (keeps a11y), but ring shows only on keyboard due to focus-visible
  useEffect(() => {
    if (open) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [open]);

  // BODY SCROLL LOCK while drawer is open + compensate scrollbar width
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

    const prevent = (e) => e.preventDefault();
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("touchmove", prevent, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("touchmove", prevent);
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
        onClick={onClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Drawer panel */}
      <aside
        id="settings-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`fixed top-0 right-0 z-[100] h-full w-[320px] max-w-[90vw]
                    bg-[#013C54] text-white shadow-2xl border-l border-white/10
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}
                    flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 id="drawer-title" className="text-base font-semibold">{title}</h3>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 cursor-pointer"
            aria-label="Close settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white/90">Time format</h4>
            <p className="text-xs text-white/60">Choose how prayer times are displayed.</p>
            <SegmentedTimeToggle value={format} onChange={setFormat} />
          </div>
        </div>
      </aside>
    </>
  );
}
