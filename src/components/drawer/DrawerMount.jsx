import { useState } from "react";
import EdgeTab from "./EdgeTab.jsx";
import Drawer from "./Drawer.jsx";
import { AnnouncementsDataProvider } from "../../context/AnnouncementsDataContext.jsx";

export default function DrawerMount() {
  const [open, setOpen] = useState(false);

  return (
    <AnnouncementsDataProvider>
      <Drawer open={open} onClose={() => setOpen(false)} />
      <EdgeTab open={open} onClick={() => setOpen(true)} side="right" />
    </AnnouncementsDataProvider>
  );
}
