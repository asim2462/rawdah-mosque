import PrayerTimeRow from "./PrayerTimeRow";

function PrayerTimes({ times, date, day, dhul_hijjah }) {
  return (
    <div className="flex justify-center w-full px-2">
      <div className="relative overflow-x-auto w-full max-w-xl">
        <div className="mb-2 text-center">
          <div className="font-bold text-lg">
            {date}
          </div>
          {dhul_hijjah && (
            <div className="text-sm text-gray-500">
              {dhul_hijjah} Dhul Hijjah 
            </div>
          )}
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Prayer</th>
              <th scope="col" className="px-6 py-3">Start</th>
              <th scope="col" className="px-6 py-3">Iqamah</th>
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
