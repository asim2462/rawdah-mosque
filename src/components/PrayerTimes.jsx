import PrayerTimeRow from "./PrayerTimeRow";

function PrayerTimes({ times }) {
  return (
    <div className="flex justify-center w-full px-2">
      <div className="relative overflow-x-auto w-full max-w-xl">
        <table className="w-full text-sm text-gray-500 bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Prayer</th>
              <th scope="col" className="px-6 py-3 text-center">Start</th>
              <th scope="col" className="px-6 py-3 text-center">Iqamah</th>
            </tr>
          </thead>
          <tbody>
            {times.map((prayer, idx) => (
              <PrayerTimeRow
                key={`${prayer.name}-${prayer.time}-${prayer.iqamah}-${idx}`}
                name={prayer.name}
                time={prayer.time}
                iqamah={prayer.iqamah}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrayerTimes;
