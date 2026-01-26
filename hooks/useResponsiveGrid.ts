import { useWindowDimensions } from 'react-native';

export function useResponsiveGrid(gap: number = 12, containerPadding: number = 24) {
  const { width } = useWindowDimensions();

  // Breakpoint: Tablet starts at 768px
  const isTablet = width >= 768;
  
  // Mobile: 2 Columns (Clean comparison)
  // Tablet: 4 Columns (High density)
  const numColumns = isTablet ? 4 : 2;

  // Calculate strict Bento Unit
  const availableWidth = width - (containerPadding * 2);
  const totalGapWidth = gap * (numColumns - 1);
  const bentoUnit = (availableWidth - totalGapWidth) / numColumns;

  return {
    bentoUnit,
    numColumns,
    gap,
    containerPadding,
    isTablet,
    width
  };
}