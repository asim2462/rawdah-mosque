// src/components/date/PreviewBanner.jsx

export default function PreviewBanner({ active, onBack }) {
    if (!active) return null;

    return (
        <div className="mt-2 mb-2">
            <button
                type="button"
                onClick={onBack}
                className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm
                   hover:opacity-90 cursor-pointer focus:outline-none focus-visible:ring-2 
                   focus-visible:ring-white/30"
            >
                Back to today
            </button>
        </div>
    );
}
