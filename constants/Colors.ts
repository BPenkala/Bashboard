// Bashboard/constants/Colors.ts

export const theme = {
  // THE "SLATE & CORNFLOWER" PALETTE
  canvas:       '#F2F2F2', // Main background (Light Grey)
  primary:      '#88A2F2', // Primary actions (Cornflower Blue)
  secondary:    '#D0F2D3', // Success/Growth (Mint Green)
  accent:       '#ACBEF2', // Secondary accent (Sky Blue)
  surface:      '#FFFFFF', // Card backgrounds
  
  // TYPOGRAPHY
  ink:          '#1D1F26', // High-contrast text (Midnight)
  inkMuted:     '#6B7280', // Subtle labels
  white:        '#FFFFFF',
  
  // GLASS & BORDERS
  border:       'rgba(29, 31, 38, 0.05)',
  glassBorder:  'rgba(255, 255, 255, 0.2)',
};

export const palette = theme;

// Safety Aliases for component stability
export const primitives = {
  midnight: theme.ink,
  cream: theme.canvas,
  sand: theme.accent,
  cinnabar: theme.primary,
  cobalt: theme.primary,
  white: '#FFFFFF',
};

export const EDITOR_TEXT_COLORS = [
  theme.primary,
  theme.ink,
  theme.secondary,
  theme.white,
];