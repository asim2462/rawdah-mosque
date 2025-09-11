import { createContext, useContext, useEffect, useMemo, useState } from "react";

const TimeFormatContext = createContext({ format: "24h", setFormat: () => {} });

function detectDefaultFormat() {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
      .formatToParts(new Date());
    return parts.some(p => p.type === "dayPeriod") ? "12h" : "24h";
  } catch {
    return "24h";
  }
}

export function TimeFormatProvider({ children }) {
  const [format, setFormat] = useState(() => {
    try {
      return localStorage.getItem("timeFormat") || detectDefaultFormat();
    } catch {
      return detectDefaultFormat();
    }
  });

  useEffect(() => {
    try { localStorage.setItem("timeFormat", format); } catch {}
  }, [format]);

  const value = useMemo(() => ({ format, setFormat }), [format]);
  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormat() {
  return useContext(TimeFormatContext);
}
