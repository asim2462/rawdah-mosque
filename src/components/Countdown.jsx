function getTimeDiffString(targetTime, now) {
  if (!targetTime) return "";
  const diff = targetTime - now;
  if (diff <= 0) return "Now";

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`;
}

export default function Countdown({ targetDateTime, label, now }) {
  const remaining = getTimeDiffString(targetDateTime, now);

  return (
    <div className="my-4 text-center text-lg text-green-700">
      <span className="font-normal">{label} in: </span>
      <span className="font-bold font-mono">{remaining}</span>
    </div>
  );
}
