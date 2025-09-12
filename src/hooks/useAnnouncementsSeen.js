import { useCallback, useEffect, useRef, useState } from "react";
import { MOSQUE_ID } from "/src/config";

const keyFor = (mosqueId = MOSQUE_ID) => `rawdah:announcements:seen:${mosqueId}`;
const getStore = () => (typeof window !== "undefined" ? window.localStorage : null);

function readSeenSet(mosqueId) {
    try {
        const s = getStore();
        if (!s) return {};
        const raw = s.getItem(keyFor(mosqueId));
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function writeSeenSet(mosqueId, obj) {
    try {
        const s = getStore();
        if (!s) return;
        s.setItem(keyFor(mosqueId), JSON.stringify(obj));
    } catch {
        // ignore storage errors
    }
}

/**
 * useAnnouncementsSeen — per-announcement "seen" with:
 * - seenSet: live state (updates immediately, persisted)
 * - displaySeenSet: **session baseline** (captured once per load; does NOT change)
 * - markSeen(ids): stable; functional state update; no-ops when unchanged
 */
export default function useAnnouncementsSeen(mosqueId = MOSQUE_ID) {
    const [seenSet, setSeenSet] = useState(() => readSeenSet(mosqueId));
    // Capture baseline once for this session so NEW stays visible until next refresh
    const baselineRef = useRef(readSeenSet(mosqueId));

    // If mosqueId changes at runtime, update the session baseline accordingly
    useEffect(() => {
        baselineRef.current = readSeenSet(mosqueId);
    }, [mosqueId]);

    // Persist whenever seenSet changes
    useEffect(() => {
        writeSeenSet(mosqueId, seenSet);
    }, [mosqueId, seenSet]);

    // Stable callback: does not depend on seenSet
    const markSeen = useCallback((ids) => {
        if (!ids || ids.length === 0) return;

        const now = Date.now();
        setSeenSet((prev) => {
            let changed = false;
            const next = { ...prev };

            for (const id of ids) {
                if (id == null) continue;
                if (!next[id]) {
                    next[id] = now;
                    changed = true;
                }
            }

            // Cap size to avoid unbounded growth
            if (changed) {
                const entries = Object.entries(next);
                if (entries.length > 220) {
                    entries.sort((a, b) => b[1] - a[1]); // newest first
                    return Object.fromEntries(entries.slice(0, 200));
                }
                return next;
            }
            return prev; // no change
        });
    }, [mosqueId]);

    const hasSeen = useCallback((id) => !!seenSet[id], [seenSet]);

    return {
        seenSet,                // live/persisted
        displaySeenSet: baselineRef.current, // session baseline for rendering NEW
        hasSeen,
        markSeen,
    };
}
