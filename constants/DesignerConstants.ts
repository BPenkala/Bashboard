/**
 * DesignerConstants.ts
 * Consolidates static data and template generation logic for the Design Studio.
 */

// 1. EVENT CATEGORIES
export const EVENT_TYPES = [
  'Birthday', 'Wedding', 'Dinner Party', 'Happy Hour', 'Baby Shower', 
  'Game Night', 'Networking', 'Trip', 'Anniversary', 'Graduation', 
  'Housewarming', 'Bachelor Party', 'Bachelorette Party', 'Engagement', 
  'Bridal Shower', 'Family Reunion', 'Holiday Party', 'Movie Night', 
  'Brunch', 'Concert', 'Fundraiser', 'Workshop', 'Conference', 'Retreat'
];

// 2. FONT ASSETS (CDN Fallbacks)
export const FALLBACK_FONTS: Record<string, string> = {
  'PlayfairDisplay-Bold': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Bold.ttf',
  'PlayfairDisplay-ExtraBold': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-ExtraBold.ttf',
  'PlayfairDisplay-Regular': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Regular.ttf',
  'Montserrat-Regular': 'https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Regular.ttf',
  'Montserrat-Bold': 'https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Bold.ttf',
  'GreatVibes-Regular': 'https://github.com/google/fonts/raw/main/ofl/greatvibes/GreatVibes-Regular.ttf',
  'Oswald-Regular': 'https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Regular.ttf',
  'Oswald-Bold': 'https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Bold.ttf',
  'Oswald-Medium': 'https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Medium.ttf',
  'Merriweather-Regular': 'https://github.com/google/fonts/raw/main/ofl/merriweather/static/Merriweather-Regular.ttf',
  'Merriweather-Bold': 'https://github.com/google/fonts/raw/main/ofl/merriweather/static/Merriweather-Bold.ttf',
  'Raleway-Regular': 'https://github.com/google/fonts/raw/main/ofl/raleway/static/Raleway-Regular.ttf',
  'Raleway-Bold': 'https://github.com/google/fonts/raw/main/ofl/raleway/static/Raleway-Bold.ttf',
  'Raleway-Medium': 'https://github.com/google/fonts/raw/main/ofl/raleway/static/Raleway-Medium.ttf',
};

// 3. BASE LAYOUT DEFINITIONS
const baseLayouts = {
    modern: {
        header: { y: 40, x: 20, width: 335, align: 'left', size: 10, fontFamily: 'Oswald-Regular', tracking: 2 },
        main: { y: 60, x: 20, width: 335, align: 'left', size: 42, fontFamily: 'Oswald-Bold', lineHeight: 1.1 },
        dateLabel: { y: 220, x: 20, width: 335, align: 'left', size: 14, fontFamily: 'Oswald-Medium' },
        timeLabel: { y: 240, x: 20, width: 335, align: 'left', size: 14, fontFamily: 'Oswald-Regular' },
        location: { y: 260, x: 20, width: 335, align: 'left', size: 12, fontFamily: 'Oswald-Regular' }
    },
    elegant: {
        header: { y: 30, x: 0, width: 375, align: 'center', size: 12, fontFamily: 'Montserrat-Regular', tracking: 3 },
        main: { y: 60, x: 0, width: 375, align: 'center', size: 32, fontFamily: 'PlayfairDisplay-ExtraBold', lineHeight: 1.2 },
        dateLabel: { y: 180, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Montserrat-Bold' },
        timeLabel: { y: 205, x: 0, width: 375, align: 'center', size: 16, fontFamily: 'Montserrat-Regular' },
        location: { y: 230, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'Montserrat-Regular' }
    },
    script: {
        header: { y: 40, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'GreatVibes-Regular' },
        main: { y: 80, x: 0, width: 375, align: 'center', size: 48, fontFamily: 'GreatVibes-Regular' },
        dateLabel: { y: 190, x: 0, width: 375, align: 'center', size: 18, fontFamily: 'GreatVibes-Regular' },
        timeLabel: { y: 215, x: 0, width: 375, align: 'center', size: 18, fontFamily: 'GreatVibes-Regular' },
        location: { y: 240, x: 0, width: 375, align: 'center', size: 14, fontFamily: 'GreatVibes-Regular' }
    }
};

// 4. TEMPLATE GENERATION LOGIC
export const getTemplatesForType = (type: string) => {
    const themes: any = {
        'Birthday': [
            { bg: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38', color: '#FFF', style: 'modern' },
            { bg: 'https://images.unsplash.com/photo-1513151233558-d860c5398176', color: '#FFF', style: 'script' },
            { bg: 'https://images.unsplash.com/photo-1464349153912-bc6163bd89a7', color: '#333', style: 'elegant' },
        ],
        'Wedding': [
            { bg: 'https://images.unsplash.com/photo-1519225421980-715cb0202128', color: '#FFF', style: 'elegant' },
            { bg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', color: '#FFF', style: 'script' },
            { bg: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7', color: '#FFF', style: 'modern' },
        ],
        'Default': [
            { bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', color: '#FFF', style: 'modern' },
            { bg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', color: '#FFF', style: 'script' },
            { bg: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', color: '#333', style: 'elegant' },
        ]
    };

    const selectedTheme = themes[type] || themes['Default'];
    const generatedTemplates: any[] = [];

    const bentoPattern = [
        { span: 2, height: 260 }, { span: 1, height: 260 },
        { span: 1, height: 180 }, { span: 2, height: 180 },
        { span: 3, height: 160 },
        { span: 1, height: 180 }, { span: 1, height: 180 }, { span: 1, height: 180 }
    ];

    bentoPattern.forEach((slot, index) => {
        const theme = selectedTheme[index % selectedTheme.length];
        const layoutStyle = index % 2 === 0 ? theme.style : (theme.style === 'modern' ? 'elegant' : 'modern');
        generatedTemplates.push({
            id: String(index),
            name: `${type} ${index + 1}`,
            bg: theme.bg,
            color: theme.color,
            span: slot.span,
            height: slot.height,
            overlayOpacity: 0.2,
            layout: JSON.parse(JSON.stringify(baseLayouts[layoutStyle as keyof typeof baseLayouts] || baseLayouts.modern))
        });
    });

    return generatedTemplates;
};

// 5. INITIAL STATE EXPORTS
export const INITIAL_TEMPLATES = getTemplatesForType('Default');

export const FONT_OPTIONS = [
    { label: 'Playfair', value: 'PlayfairDisplay-Bold' },
    { label: 'Montserrat', value: 'Montserrat-Bold' },
    { label: 'Great Vibes', value: 'GreatVibes-Regular' },
    { label: 'Oswald', value: 'Oswald-Bold' },
    { label: 'Merriweather', value: 'Merriweather-Bold' },
    { label: 'Raleway', value: 'Raleway-Bold' },
    { label: 'Poppins', value: 'Poppins_700Bold' },
];

export const BRAND_COLORS = [
    '#FFFFFF', '#FBF5DE', '#3D74B6', '#1A1A1A', '#DC3C22', '#EAC8A6', 
    '#000000', '#FFD700', '#2E8B57', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
];