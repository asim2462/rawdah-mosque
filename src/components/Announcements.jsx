import { useEffect, useState } from "react";
import Papa from "papaparse";

// --- CONFIGURATION: Public Google Sheet CSV for announcements ---
const ANNOUNCEMENTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQW0OEBu22Vte-nzljhvKP5s9rLx0_dsA4kPIugeh-HN6LpDlOJ6621cPR3JX_FPy_XPUUK8dAg3bLm/pub?output=csv";

/**
 * Announcements component:
 * - Fetches announcement data from a published Google Sheet.
 * - Renders each active announcement as a card.
 * - Each card has a badge, title, message, and optional link.
 * - Hidden if there are no active announcements.
 */
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Add cache-buster for fresh data on every load (browser & PWA)
    const url = ANNOUNCEMENTS_CSV_URL + "&cb=" + Date.now();

    fetch(url)
      .then((res) => res.text())
      .then((csvText) => {
        const { data } = Papa.parse(csvText, { header: true });
        const active = data.filter(
          (row) =>
            row.Active &&
            typeof row.Active === "string" &&
            row.Active.trim().toLowerCase() === "true" &&
            row.Message &&
            row.Message.trim() !== ""
        );
        setAnnouncements(active);
      })
      .catch(() => setAnnouncements([]));
  }, []);

  if (!announcements.length) return null;

  return (
    <section
      aria-label="Announcements"
      className="w-full max-w-2xl mx-auto my-4 flex flex-col items-center gap-4"
    >
      {announcements.map((a, idx) => (
        <article
          key={a.ID || idx}
          className="relative w-full max-w-xl bg-[#175841] rounded-2xl shadow-lg px-6 py-5 text-white flex flex-col gap-3"
          aria-label={a.Title ? `Announcement: ${a.Title}` : "Announcement"}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-yellow-400/40 border border-yellow-400 text-[#ffffff] text-xs font-bold px-2 py-1 rounded-lg tracking-wide">
              NEW
            </span>
            <h3 className="text-xl font-semibold">{a.Title}</h3>
          </div>
          <p className="whitespace-pre-line text-base">{a.Message}</p>
          {a.Link && a.Link.trim() !== "" && (
            <a
              href={a.Link}
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
