import { useEffect, useRef, useState } from "react";
import { X as CloseIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnnouncementsData } from "../../context/AnnouncementsDataContext.jsx";
import TabBar from "./TabBar.jsx";
import { overlayFade, panelSpring, tabSwitch } from "../common/motionPresets";
import AnnouncementsListCompact from "../announcements/AnnouncementsListCompact.jsx";
import SettingsPanel from "./SettingsPanel.jsx";

/**
 * Drawer — tabs (icon-only) span evenly; Close (X) matches control height; uniform rounded corners.
 */
export default function Drawer({ open, onClose }) {
  const panelRef = useRef(null);
  const [activeTab, setActiveTab] = useState("announcements");

  const {
    items: annItems,
    loading: annLoading,
    error: annError,
    displaySeenSet,
    markSeen,
    newWithinDays,
  } = useAnnouncementsData();

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus panel on open + body scroll lock
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Mark announcements as seen when Announcements tab opens and data is ready.
  useEffect(() => {
    if (!open) return;
    if (activeTab !== "announcements") return;
    if (annLoading || !annItems?.length) return;
    const ids = annItems.map((a) => a.id).filter(Boolean);
    if (ids.length) markSeen(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, annLoading, annItems]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] cursor-pointer"
            onClick={() => onClose?.()}
            aria-hidden="true"
            initial={overlayFade.initial}
            animate={overlayFade.animate}
            exit={overlayFade.exit}
            transition={overlayFade.transition}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            id="app-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="App drawer"
            ref={panelRef}
            tabIndex={-1}
            className="fixed right-0 top-0 z-[100] h-screen w-[360px] sm:w-[400px] bg-[#013C54] text-white shadow-2xl flex flex-col outline-none"
            initial={panelSpring.initial}
            animate={panelSpring.animate}
            exit={panelSpring.exit}
            transition={panelSpring.transition}
          >
            {/* Header: TabBar (flex-1, h-10) + Close (h-10 w-10), all rounded-xl */}
            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
              <TabBar value={activeTab} onChange={setActiveTab} iconsOnly className="flex-1" />
              <button
                onClick={() => onClose?.()}
                title="Close"
                aria-label="Close drawer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                           bg-white/10 text-white hover:opacity-90
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                           cursor-pointer shrink-0"
              >
                <CloseIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <AnimatePresence mode="wait">
                {activeTab === "announcements" ? (
                  <motion.div
                    key="announcements"
                    initial={tabSwitch.initial}
                    animate={tabSwitch.animate}
                    exit={tabSwitch.exit}
                    transition={tabSwitch.transition}
                    className="space-y-3"
                  >
                    <AnnouncementsListCompact
                      items={annItems}
                      loading={annLoading}
                      error={annError}
                      seenSet={displaySeenSet}
                      newWithinDays={newWithinDays}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="settings"
                    initial={tabSwitch.initial}
                    animate={tabSwitch.animate}
                    exit={tabSwitch.exit}
                    transition={tabSwitch.transition}
                    className="space-y-4"
                  >
                    <SettingsPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
