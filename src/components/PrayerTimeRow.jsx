function PrayerTimeRow({ name, time, jamaat }) {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-white whitespace-nowrap capitalize text-center"
      >
        {name}
      </th>
      <td className="px-6 py-4 text-white text-center">{time}</td>
      <td className="px-6 py-4 text-white text-center">{jamaat || "—"}</td>
    </tr>
  );
}
export default PrayerTimeRow;
