export function formatClock(value, mode = "24h") {
  if (value == null || value === "" || value === "—") return value ?? "—";
  const [hhStr = "", mmStr = ""] = String(value).split(":");
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return value;

  if (mode === "24h") {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  const isPM = hh >= 12;
  const hour12 = (hh % 12) || 12;
  return `${hour12}:${String(mm).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}
