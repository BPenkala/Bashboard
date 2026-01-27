// Bashboard/constants/Colors.ts

export const theme = {
  canvas:       '#F2F2F2', // Main background
  primary:      '#88A2F2', // Cornflower Blue
  secondary:    '#D0F2D3', 
  accent:       '#ACBEF2', 
  surface:      '#FFFFFF', 
  ink:          '#1D1F26', // Midnight
  inkMuted:     '#6B7280', 
  white:        '#FFFFFF',
  border:       'rgba(29, 31, 38, 0.05)',
  glassBorder:  'rgba(255, 255, 255, 0.2)',
};

// SPC FIX: Add default export structure for compatibility with index.tsx and invite.tsx
const Colors = {
  light: {
    ...theme,
    background: theme.canvas,
    text: theme.ink,
    primary: theme.primary,
  },
  dark: {
    ...theme,
    background: '#151718',
    text: '#ECEDEE',
  }
};

export default Colors;