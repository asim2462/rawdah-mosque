import PrayerTimeRow from "./PrayerTimeRow";

function PrayerTimes({ times, highlightedPrayer }) {
  return (
    <div className="relative overflow-x-auto w-full max-w-2xl mx-auto rounded-2xl shadow-md">
      <table className="w-full text-sm text-center bg-gray-800 rounded-2xl">
        <thead className="text-xs uppercase bg-gray-900 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-white text-center">
              Prayer
            </th>
            <th scope="col" className="px-6 py-3 text-white text-center">
              Start
            </th>
            <th scope="col" className="px-6 py-3 text-white text-center">
              Jamaat
            </th>
          </tr>
        </thead>
        <tbody>
          {times.map((prayer, idx) => (
            <PrayerTimeRow
              key={prayer.name + idx}
              name={prayer.name}
              time={prayer.time}
              jamaat={prayer.jamaat}
              isHighlighted={highlightedPrayer === prayer.name}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrayerTimes;
