import { useTimeFormat } from "../context/TimeFormatContext.jsx";
import { formatClock } from "../utils/timeFormat";

export default function TimeText({ value }) {
  const { format } = useTimeFormat();
  if (value == null || value === "") return "—";
  return <>{formatClock(value, format)}</>;
}
