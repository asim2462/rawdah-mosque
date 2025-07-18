import { useEffect, useState } from "react";

function getTimeDiffString(targetTime) {
  const now = new Date();
  const diff = targetTime - now;
  if (diff <= 0) return "Now";

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`;
}

export default function Countdown({ targetDateTime, label }) {
  const [remaining, setRemaining] = useState(getTimeDiffString(targetDateTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeDiffString(targetDateTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  return (
    <div className="my-4 text-center text-lg font-semibold text-green-700">
      Next prayer (<span className="capitalize">{label}</span>) in:{" "}
      <span className="font-mono">{remaining}</span>
    </div>
  );
}
