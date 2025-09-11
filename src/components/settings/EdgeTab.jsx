export default function EdgeTab({ open, onClick, side = "right" }) {
  const sidePos = side === "right" ? "right-0 rounded-l-xl" : "left-0 rounded-r-xl";
  const arrowDir = side === "right" ? "rotate-180" : "";
  const openState = open ? "opacity-0 translate-x-1.5 pointer-events-none" : "opacity-100";

  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-controls="settings-drawer"
      title="Open settings"
      className={`fixed z-40 ${sidePos}
                  top-[13vh] sm:top-[12vh] md:top-[11vh] lg:top-[10vh]
                  w-6 md:w-7 h-14 px-1 py-1.5
                  bg-[#56853c] hover:bg-[#4a7743] text-[#fef687]
                  shadow-lg focus:outline-none focus:ring-0 cursor-pointer
                  transition duration-300 ${openState}`}
    >
      <div className="flex h-full items-center justify-center select-none">
        <svg
          className={`${open ? "opacity-50" : ""} ${arrowDir}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}
