// Bashboard/constants/DesignerConstants.ts
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import { Lato_700Bold } from '@expo-google-fonts/lato';
import { Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Oswald_700Bold } from '@expo-google-fonts/oswald';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';

export const FALLBACK_FONTS: Record<string, any> = {
  'Anton-Regular': Anton_400Regular,
  'Cinzel-Bold': Cinzel_700Bold,
  'DancingScript-Bold': DancingScript_700Bold,
  'GreatVibes-Regular': GreatVibes_400Regular,
  'Lato-Bold': Lato_700Bold,
  'Merriweather-Bold': Merriweather_700Bold,
  'Montserrat-Bold': Montserrat_700Bold,
  'Oswald-Bold': Oswald_700Bold,
  'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
  'Raleway-Bold': Raleway_700Bold,
};

export const LAYOUT_MANIFESTS: Record<string, any> = {
    modern: { id: 'modern', label: 'Impact', elements: { 
        header: { text: 'JOIN US FOR', y: 60, x: 24, width: 327, align: 'left', size: 12, fontFamily: 'Oswald-Bold', tracking: 4, color: '#FFFFFF', uppercase: true },
        main: { y: 80, x: 24, width: 327, align: 'left', size: 56, fontFamily: 'Anton-Regular', lineHeight: 1, color: '#FFFFFF', uppercase: true },
        dateLabel: { y: 240, x: 24, width: 327, align: 'left', size: 18, fontFamily: 'Oswald-Bold', color: '#FFFFFF', uppercase: true },
        location: { y: 265, x: 24, width: 327, align: 'left', size: 14, fontFamily: 'Lato-Bold', color: '#FFFFFF' }
    }},
    elegant: { id: 'elegant', label: 'Vogue', elements: { 
        header: { text: 'You are invited', y: 50, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Raleway-Bold', tracking: 2, color: '#FFFFFF', uppercase: true },
        main: { y: 80, x: 20, width: 335, align: 'center', size: 38, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 1.2, color: '#FFFFFF' },
        dateLabel: { y: 200, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Raleway-Bold', color: '#FFFFFF' },
        location: { y: 230, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Raleway-Bold', color: '#FFFFFF' }
    }}
};

export const FONT_OPTIONS = [
  { label: 'Impact', value: 'Anton-Regular' }, { label: 'Royal', value: 'Cinzel-Bold' },
  { label: 'Party', value: 'DancingScript-Bold' }, { label: 'Romance', value: 'GreatVibes-Regular' },
  { label: 'Clean', value: 'Lato-Bold' }, { label: 'News', value: 'Merriweather-Bold' },
  { label: 'Urban', value: 'Montserrat-Bold' }, { label: 'Bold', value: 'Oswald-Bold' },
  { label: 'Vogue', value: 'PlayfairDisplay-Bold' }, { label: 'Elegant', value: 'Raleway-Bold' }
];

export const COLOR_PALETTE = [
  '#FFFFFF', '#1D1F26', '#88A2F2', '#ACBEF2', '#D0F2D3', '#F2F2F2',
  '#FF6B6B', '#FF8E72', '#FFAF6C', '#FFD93D', '#6BCB77', '#4D96FF',
  '#6D5DFC', '#B983FF', '#FF9F9F', '#94D0CC', '#B8DFD8', '#2C3E50',
  '#E74C3C', '#3498DB', '#9B59B6', '#F1C40F', '#1ABC9C', '#E67E22'
];

export const EVENT_TYPES = ['Birthday', 'Wedding', 'Dinner Party', 'Baby Shower', 'Graduation', 'Holiday', 'Game Night', 'Brunch'];

export const INITIAL_TEMPLATES = [
    { id: 'initial', bg: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&w=800' }
];