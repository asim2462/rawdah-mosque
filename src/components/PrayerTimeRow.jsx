function PrayerTimeRow({ name, time, jamaat, isHighlighted, idx }) {
  // Use highlight color, otherwise alternate backgrounds by index
  let rowBg;
  if (isHighlighted) {
    rowBg = "bg-yellow-400/40 border-yellow-400";
  } else {
    rowBg =
      (idx % 2 === 0
        ? "bg-[#1c343e]"
        : "bg-[#30424e]") +
      " border-b border-gray-700";
  }
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
