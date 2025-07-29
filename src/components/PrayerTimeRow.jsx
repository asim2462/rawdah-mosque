/**
 * Renders a table row for a single prayer time.
 * - Applies correct background color: highlighted, or striped for alternating rows.
 * - Ensures accessibility with aria-current on the highlighted row.
 * - Uses custom fonts for both regular and highlighted rows.
 * - Handles empty Jamaat times with an em-dash fallback.
 */
function PrayerTimeRow({ name, time, jamaat, isHighlighted, idx }) {
  // Determine row background: highlight if active, otherwise alternate for zebra-striping.
  const rowBg = isHighlighted
    ? "bg-[#bf9743] border-[#bf9743]"
    : idx % 2 === 0
      ? "bg-[#163c4c]"
      : "bg-[#2b4859]";

  // Text color for all rows.
  const textColor = "text-white";
  // Use the demi-bold font for highlighted row, regular otherwise.
  const fontFamily = isHighlighted ? 'avenir-next-demi-bold' : 'avenir-next-regular';
  // For extra consistency across browsers, set font-weight too.
  const fontWeight = isHighlighted ? 'bold' : 'normal';

  return (
    <tr
      className={`${rowBg} transition-colors duration-300`}
      // Use aria-current for accessibility: helps screen readers know which row is "current"
      aria-current={isHighlighted ? "true" : undefined}
    >
      {/* First cell is a row header (WCAG best practice), always bold/strong. */}
      <th
        scope="row"
        className={`px-6 py-4 font-medium whitespace-nowrap capitalize text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        {name}
      </th>
      {/* Start time cell */}
      <td
        className={`px-6 py-4 text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        {time}
      </td>
      {/* Jamaat cell: fallback to em-dash if no value */}
      <td
        className={`px-6 py-4 text-center ${textColor}`}
        style={{ fontFamily, fontWeight }}
      >
        {jamaat || "—"}
      </td>
    </tr>
  );
}

export default PrayerTimeRow;
