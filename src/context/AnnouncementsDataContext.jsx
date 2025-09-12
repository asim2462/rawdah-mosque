import { createContext, useContext, useMemo } from "react";
import useAnnouncements from "../hooks/useAnnouncements.js";
import useAnnouncementsSeen from "../hooks/useAnnouncementsSeen.js";

const AnnouncementsDataContext = createContext(null);

// Helper: "within last N days"
function withinDays(dateLike, days) {
    if (!dateLike) return false;
    const ts = new Date(dateLike).getTime();
    if (Number.isNaN(ts)) return false;
    const diffMs = Date.now() - ts;
    return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

/**
 * AnnouncementsDataProvider
 * - Single source of truth for announcements + session-baseline "seen"
 * - Exposes: items, loading, error, unreadCount, displaySeenSet, markSeen, refetch
 */
export function AnnouncementsDataProvider({ children, limit = 25, newWithinDays = 7 }) {
    const { items, loading, error, refetch } = useAnnouncements({ limit, activeOnly: true });
    const { displaySeenSet, markSeen } = useAnnouncementsSeen();

    const unreadCount = useMemo(() => {
        if (loading || !items) return 0;
        return items.filter(a => withinDays(a.created_at, newWithinDays) && !displaySeenSet[a.id]).length;
    }, [items, loading, displaySeenSet, newWithinDays]);

    const value = useMemo(() => ({
        items,
        loading,
        error,
        refetch,
        displaySeenSet,   // session baseline (doesn't change until refresh)
        markSeen,         // persists "seen" immediately (for next refresh)
        unreadCount,
        newWithinDays,
    }), [items, loading, error, refetch, displaySeenSet, markSeen, unreadCount, newWithinDays]);

    return (
        <AnnouncementsDataContext.Provider value={value}>
            {children}
        </AnnouncementsDataContext.Provider>
    );
}

export function useAnnouncementsData() {
    const ctx = useContext(AnnouncementsDataContext);
    if (!ctx) throw new Error("useAnnouncementsData must be used within AnnouncementsDataProvider");
    return ctx;
}
