function PrayerTimeRow({ name, time, jamaat, isHighlighted }) {
  // Highlighted row: yellow background, white bold text for all cells
  const rowBg = isHighlighted
    ? "bg-yellow-400/40 border-yellow-400"
    : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200";
  const textColor = "text-white" + (isHighlighted ? " font-bold" : "");

  return (
    <tr
      className={`${rowBg} transition-colors duration-300`}
      aria-current={isHighlighted ? "true" : undefined}
    >
      <th
        scope="row"
        className={`px-6 py-4 font-medium whitespace-nowrap capitalize text-center ${textColor}`}
      >
        {name}
      </th>
      <td className={`px-6 py-4 text-center ${textColor}`}>{time}</td>
      <td className={`px-6 py-4 text-center ${textColor}`}>{jamaat || "—"}</td>
    </tr>
  );
}
export default PrayerTimeRow;
