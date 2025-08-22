import { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient";
import { MOSQUE_ID } from "/src/config";

/**
 * Announcements Component
 * Fetches and displays active announcements for the given mosque.
 */
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch only active announcements for this mosque, newest first
    async function fetchAnnouncements() {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("mosque_id", MOSQUE_ID)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setAnnouncements([]);
        return;
      }
      setAnnouncements(data || []);
    }
    fetchAnnouncements();
  }, []);

  // If no active announcements, render nothing
  if (!announcements.length) return null;

  return (
    <section
      aria-label="Announcements"
      className="w-full max-w-2xl mx-auto my-4 flex flex-col items-center gap-4"
    >
      {announcements.map((a, idx) => (
        <article
          key={a.id || idx}
          className="relative w-full max-w-xl bg-[#56853c] rounded-2xl shadow-lg px-6 py-5 text-white flex flex-col gap-3"
          aria-label={a.title ? `Announcement: ${a.title}` : "Announcement"}
        >
          {/* Announcement badge and title */}
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-yellow-400/40 border border-yellow-400 text-[#ffffff] text-xs font-bold px-2 py-1 rounded-lg tracking-wide">
              NEW
            </span>
            <h3 className="text-xl font-semibold">{a.title}</h3>
          </div>

          {/* Announcement message */}
          <p className="whitespace-pre-line text-base">{a.message}</p>

          {/* Optional link */}
          {a.link && a.link.trim() !== "" && (
            <a
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-200 hover:text-white"
            >
              More info
            </a>
          )}
        </article>
      ))}
    </section>
  );
}
