// Bashboard/constants/DesignerConstants.ts

export const FALLBACK_FONTS: Record<string, string> = {
  'PlayfairDisplay-Bold': 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXdKm61WvM1EBf.ttf',
  'Montserrat-Bold': 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM7Hw5aXo.ttf',
  'GreatVibes-Regular': 'https://fonts.gstatic.com/s/greatvibes/v15/RWm0oL6MljYzSId71dHkJEDD5Fj0Et8.ttf',
  'Oswald-Bold': 'https://fonts.gstatic.com/s/oswald/v49/v8_XL23_q6W7z_5pMDhY6T9eXv77u8p2lV1u.ttf',
};

export const INITIAL_TEMPLATES = [
    { id: 'initial', bg: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&w=800' }
];

export const FONT_OPTIONS = [
    { label: 'Poppins (UI)', value: 'Poppins_700Bold' }, 
    { label: 'Playfair', value: 'PlayfairDisplay-Bold' },
    { label: 'Montserrat', value: 'Montserrat-Bold' },
    { label: 'Modern', value: 'Oswald-Bold' },
    { label: 'Script', value: 'GreatVibes-Regular' }
];

export const BRAND_COLORS = ['#88A2F2', '#ACBEF2', '#1D1F26', '#D0F2D3', '#F2F2F2', '#FFFFFF'];