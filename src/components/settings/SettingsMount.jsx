import { useState } from "react";
import EdgeTab from "./EdgeTab.jsx";
import SettingsDrawer from "./SettingsDrawer.jsx";

export default function SettingsMount() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
      <EdgeTab open={open} onClick={() => setOpen(true)} side="right" />
    </>
  );
}
