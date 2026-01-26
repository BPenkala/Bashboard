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

// 1. THE ASSET REGISTRY (Tier 2 Bundle)
// These are the fonts that will be lazy-loaded when the studio opens.
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

// 2. THE DESIGN MANIFESTS (The "Smart Flyer" Logic)
// Each key represents a distinct visual identity that can be applied to ANY background.
export const LAYOUT_MANIFESTS: Record<string, any> = {
    modern: {
        id: 'modern',
        label: 'Impact',
        elements: {
            header: { text: 'JOIN US FOR', y: 60, x: 24, width: 327, align: 'left', size: 12, fontFamily: 'Oswald-Bold', tracking: 4, color: '#FFFFFF', uppercase: true },
            main: { y: 80, x: 24, width: 327, align: 'left', size: 56, fontFamily: 'Anton-Regular', lineHeight: 1, color: '#FFFFFF', uppercase: true },
            dateLabel: { y: 240, x: 24, width: 327, align: 'left', size: 18, fontFamily: 'Oswald-Bold', color: '#FFFFFF', uppercase: true },
            location: { y: 265, x: 24, width: 327, align: 'left', size: 14, fontFamily: 'Lato-Bold', color: '#FFFFFF' }
        }
    },
    elegant: {
        id: 'elegant',
        label: 'Vogue',
        elements: {
            header: { text: 'You are invited', y: 50, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Raleway-Bold', tracking: 2, color: '#FFFFFF', uppercase: true },
            main: { y: 80, x: 20, width: 335, align: 'center', size: 38, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 1.2, color: '#FFFFFF' },
            dateLabel: { y: 200, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Raleway-Bold', color: '#FFFFFF' },
            location: { y: 230, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Raleway-Bold', color: '#FFFFFF' }
        }
    },
    whimsical: {
        id: 'whimsical',
        label: 'Party',
        elements: {
            header: { text: "Let's Celebrate", y: 70, x: 0, width: 375, align: 'center', size: 24, fontFamily: 'DancingScript-Bold', color: '#FFFFFF' },
            main: { y: 110, x: 10, width: 355, align: 'center', size: 42, fontFamily: 'Montserrat-Bold', lineHeight: 1.1, color: '#FFFFFF', uppercase: true },
            dateLabel: { y: 250, x: 0, width: 375, align: 'center', size: 18, fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
            location: { y: 280, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF' }
        }
    },
    classic: {
        id: 'classic',
        label: 'Royal',
        elements: {
            header: { text: 'REQUEST THE HONOR OF YOUR PRESENCE', y: 40, x: 0, width: 375, align: 'center', size: 10, fontFamily: 'Cinzel-Bold', tracking: 2, color: '#FFFFFF' },
            main: { y: 70, x: 20, width: 335, align: 'center', size: 36, fontFamily: 'Cinzel-Bold', lineHeight: 1.3, color: '#FFFFFF' },
            dateLabel: { y: 220, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Merriweather-Bold', color: '#FFFFFF' },
            location: { y: 250, x: 0, width: 375, align: 'center', size: 12, fontFamily: 'Merriweather-Bold', color: '#FFFFFF' }
        }
    },
    script: {
        id: 'script',
        label: 'Romance',
        elements: {
            header: { text: 'Save the Date', y: 80, x: 40, width: 335, align: 'left', size: 32, fontFamily: 'GreatVibes-Regular', color: '#FFFFFF' },
            main: { y: 130, x: 40, width: 300, align: 'left', size: 32, fontFamily: 'Lato-Bold', lineHeight: 1.2, color: '#FFFFFF', uppercase: true },
            dateLabel: { y: 240, x: 40, width: 335, align: 'left', size: 14, fontFamily: 'Lato-Bold', color: '#FFFFFF' },
            location: { y: 265, x: 40, width: 335, align: 'left', size: 12, fontFamily: 'Lato-Bold', color: '#FFFFFF' }
        }
    }
};

export const INITIAL_TEMPLATES = [
    { id: 'initial', bg: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&w=800' }
];

export const BRAND_COLORS = ['#88A2F2', '#ACBEF2', '#1D1F26', '#D0F2D3', '#F2F2F2', '#FFFFFF'];