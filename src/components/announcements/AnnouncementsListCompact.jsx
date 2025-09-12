import { ArrowUpRight } from "lucide-react";

/**
 * AnnouncementsListCompact — compact list layout for the Drawer (no icon).
 * Renders full text (no truncation), preserving line breaks.
 *
 * Props:
 *  - items: array of { id, title, message, link, created_at, updated_at }
 *  - loading: boolean
 *  - error: object|null
 *  - seenSet?: Record<string, number>  // from useAnnouncementsSeen (session baseline)
 *  - newWithinDays?: number (default 7) // time gate for "NEW" badge
 */
export default function AnnouncementsListCompact({
    items,
    loading,
    error,
    seenSet = {},
    newWithinDays = 7,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl bg-[#56853c] p-4 text-sm text-white/90 shadow-sm">
                Loading announcements…
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-[#56853c] p-4 text-sm text-white shadow-sm">
                <p className="text-white">Couldn’t load announcements.</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="rounded-2xl bg-[#56853c] p-4 text-sm text-white/90 shadow-sm">
                No announcements right now.
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {items.map((a) => {
                const withinWindow = isWithinDays(a?.created_at, newWithinDays);
                const isNew = !seenSet[a.id] && withinWindow;
                const url = normalizeExternalUrl(a.link);

                return (
                    <li key={a.id} className="rounded-2xl bg-[#56853c] p-4 shadow-sm">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="pr-1 text-sm font-semibold text-white">{a.title}</h4>
                                {isNew && (
                                    <span className="inline-flex items-center rounded-full bg-[#bf9743]/90 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                                        NEW
                                    </span>
                                )}
                            </div>

                            {a.message ? (
                                <p className="mt-2 text-sm text-white/90 whitespace-pre-wrap">
                                    {a.message}
                                </p>
                            ) : null}

                            {url ? (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={`Open URL: ${url}`}
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#fef687] hover:underline"
                                >
                                    Open URL
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </a>
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function isWithinDays(dateLike, days) {
    if (!dateLike) return false;
    const created = new Date(dateLike).getTime();
    if (Number.isNaN(created)) return false;
    const diffMs = Date.now() - created;
    const daysMs = days * 24 * 60 * 60 * 1000;
    return diffMs >= 0 && diffMs <= daysMs;
}

/**
 * normalizeExternalUrl — ensures links open as absolute external URLs.
 * - Accepts http(s), mailto:, tel:, sms:, geo:, and protocol-relative //host
 * - If it looks like a bare domain (with a dot), prefixes https://
 * - Otherwise returns null (don’t render a link)
 */
function normalizeExternalUrl(link) {
    if (!link) return null;
    const raw = String(link).trim();
    if (!raw) return null;

    if (/^(https?:|mailto:|tel:|sms:|geo:)/i.test(raw)) return raw;
    if (raw.startsWith("//")) return "https:" + raw;
    if (raw.includes(".") && !/\s/.test(raw) && !raw.startsWith("/")) return "https://" + raw;
    return null;
}
