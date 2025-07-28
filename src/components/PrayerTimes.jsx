import PrayerTimeRow from "./PrayerTimeRow";

function PrayerTimes({ times, highlightedPrayer }) {
  return (
    <div className="relative overflow-x-auto w-full max-w-2xl mx-auto rounded-2xl shadow-md">
      <table className="w-full text-sm text-center bg-gray-800 rounded-2xl">
        <thead className="text-xs uppercase bg-[#56853c] text-[#fef687]">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              Prayer
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Start
            </th>
            <th scope="col" className="px-6 py-3 text-center">
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
              idx={idx} // pass row index
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrayerTimes;
