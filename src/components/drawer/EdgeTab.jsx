import { Megaphone } from "lucide-react";
import { useAnnouncementsData } from "../../context/AnnouncementsDataContext.jsx";

export default function EdgeTab({ open, onClick, side = "right" }) {
  const { unreadCount } = useAnnouncementsData();
  const hasUnread = (unreadCount ?? 0) > 0;
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  const sidePos = side === "right" ? "right-0 rounded-l-xl" : "left-0 rounded-r-xl";
  const arrowDir = side === "right" ? "rotate-180" : "";
  const openState = open ? "opacity-0 translate-x-1.5 pointer-events-none" : "opacity-100";

  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-controls="app-drawer"
      title="Open settings"
      className={`fixed z-40 ${sidePos}
                  top-[13vh] sm:top-[12vh] md:top-[11vh] lg:top-[10vh]
                  w-6 md:w-7 h-14 px-1 py-1.5
                  bg-[#56853c] hover:bg-[#4a7743] text-[#fef687]
                  shadow-lg focus:outline-none focus:ring-0 cursor-pointer
                  transition duration-300 ${openState}`}
    >
      <div className="relative flex h-full items-center justify-center select-none">
        {hasUnread ? (
          <>
            <Megaphone className={`${open ? "opacity-50" : ""}`} size={14} aria-hidden="true" />
            <span
              aria-hidden="true"
              className={`absolute -top-1 ${side === "right" ? "-right-1" : "-left-1"}
                          min-w-4 h-4 px-1 rounded-full bg-red-600
                          text-white text-[10px] font-bold leading-4
                          grid place-items-center`}
            >
              {badgeText}
            </span>
          </>
        ) : (
          <svg
            className={`${open ? "opacity-50" : ""} ${arrowDir}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </div>
    </button>
  );
}
