// Centralized motion presets for consistency
export const overlayFade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.20, ease: "easeOut" },
};

export const panelSpring = {
    initial: { x: 420, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 420, opacity: 0 },
    transition: { type: "spring", stiffness: 360, damping: 36 },
};

export const tabSwitch = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18, ease: "easeOut" },
};

// Springs for animated pills
export const tabPillSpring = { type: "spring", stiffness: 300, damping: 28 };
export const segPillSpring = { type: "spring", stiffness: 300, damping: 28 };
