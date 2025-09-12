import { useCallback, useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient";
import { MOSQUE_ID } from "/src/config";

/**
 * useAnnouncements — fetch active announcements, newest first.
 * Uses the DB field "message" (no "body").
 *
 * Options:
 *  - limit: number (default 4) — number of items to fetch (not text length)
 *  - activeOnly: boolean (default true)
 *
 * Returns: { items, loading, error, refetch }
 *
 * Each item: { id, title, message, link, created_at, updated_at, active }
 */
export default function useAnnouncements({ limit = 4, activeOnly = true } = {}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from("announcements")
                .select("id, title, message, link, created_at, updated_at, active, mosque_id")
                .eq("mosque_id", MOSQUE_ID)
                .order("created_at", { ascending: false });

            if (activeOnly) query = query.eq("active", true);
            if (limit) query = query.limit(limit);

            const { data, error } = await query;
            if (error) {
                setError(error);
                setItems([]);
            } else {
                const normalized = (data || []).map((row) => ({
                    id: row.id,
                    title: row.title ?? "",
                    message: (row.message && String(row.message)) || "",
                    link: row.link || null,
                    created_at: row.created_at || null,
                    updated_at: row.updated_at || row.created_at || null,
                    active: !!row.active,
                }));
                setItems(normalized);
            }
        } catch (e) {
            setError(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [limit, activeOnly]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    return { items, loading, error, refetch: fetchAnnouncements };
}
