import TimeText from "./TimeText";

/**
 * Renders a table row for a single prayer time.
 * - Original visual style restored (no row dividers, taller rows, centered cells).
 * - Highlighted row uses gold background with white text.
 * - Uses Avenir Next for body/highlight (as in original).
 * - Handles empty Jamaat times with an em-dash fallback.
 */
function PrayerTimeRow({ name, time, jamaat, isHighlighted, idx }) {
  // Row background: highlight active row; otherwise zebra stripes
  const rowBg = isHighlighted
    ? "bg-[#bf9743] border-[#bf9743]"
    : idx % 2 === 0
      ? "bg-[#163c4c]"
      : "bg-[#2b4859]";

  // Original text color was white across all rows
  const textColor = "text-white";

  // Original font family/weight: Avenir Next (demi-bold when highlighted)
  const fontFamily = isHighlighted ? "avenir-next-demi-bold" : "avenir-next-regular";
  const fontWeight = isHighlighted ? "bold" : "normal";

  return (
    // NOTE: no row border — restores the smooth, card-like table look
    <tr className={`${rowBg} transition-colors duration-300`} aria-current={isHighlighted ? "true" : undefined}>
      {/* Prayer name — centered, capitalized, medium weight */}
      <td
        className={`px-6 py-4 font-medium whitespace-nowrap capitalize text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        {name}
      </td>

      {/* Start time — centered */}
      <td
        className={`px-6 py-4 text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        <TimeText value={time} />
      </td>

      {/* Jamaat time — centered, em-dash fallback */}
      <td
        className={`px-6 py-4 text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        {jamaat ? <TimeText value={jamaat} /> : "—"}
      </td>
    </tr>
  );
}

export default PrayerTimeRow;
