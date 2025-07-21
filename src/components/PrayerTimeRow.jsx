function PrayerTimeRow({ name, time, jamaat, isHighlighted }) {
  // If highlighted, use black text for contrast, else use white
  const textColor = isHighlighted ? "text-black font-bold" : "text-white";
  const rowBg = isHighlighted
    ? "bg-yellow-400/40 border-yellow-400"
    : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200";

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
