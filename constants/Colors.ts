// Bashboard/constants/Colors.ts

export const primitives = {
  // THE FOUNDATION
  cobalt:       '#3D74B6', // UI-1: Anchor (Hero Tiles)
  cream:        '#FBF5DE', // UI-2: Canvas (App Background)
  sand:         '#EAC8A6', // UI-3: Soft Divider (Utility Tiles)
  cinnabar:     '#DC3C22', // UI-4: Pulse (High Priority)
  midnight:     '#1B3352', // UI-5: Darkened Cobalt for text on Sand
  white:        '#FFFFFF',
  overlay:      'rgba(255, 255, 255, 0.05)', // For Glassmorphism Lite
};

export const PALETTE = primitives;

// THEME MAPPING based on Heritage Tech functional weights
export const THEME = {
  planner: {
    primary: primitives.cobalt,
    action: primitives.cinnabar,
    highlight: 'rgba(61, 116, 182, 0.1)', // Subtle Cobalt tint
  },
  guest: {
    primary: primitives.cinnabar,
    action: primitives.cinnabar,
    highlight: 'rgba(220, 60, 34, 0.1)', // Subtle Cinnabar tint
  }
};

export const EDITOR_TEXT_COLORS = [
  primitives.cobalt,
  primitives.cinnabar,
  primitives.midnight,
  primitives.white,
];