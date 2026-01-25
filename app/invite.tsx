import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, 
  LayoutAnimation, Platform, UIManager, Dimensions, 
  Switch, KeyboardAvoidingView, Keyboard, ActivityIndicator, ImageBackground, Modal, FlatList 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker'; // <--- NEW IMPORT

// --- ANIMATION & GESTURE IMPORTS ---
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

import { useData } from '../context/DataContext';
import { primitives } from '../constants/Colors'; 
import InvitationRenderer from '../components/InvitationRenderer';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPACING = 12;
const BENTO_UNIT = (SCREEN_WIDTH - (SPACING * 4)) / 3;
const EDITOR_WIDTH = SCREEN_WIDTH - 80;
const CANVAS_SCALE = EDITOR_WIDTH / 375; 

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// --- ASSETS ---
const EVENT_TYPES = [
  'Birthday', 'Wedding', 'Dinner Party', 'Happy Hour', 'Baby Shower', 
  'Game Night', 'Networking', 'Trip', 'Anniversary', 'Graduation', 
  'Housewarming', 'Bachelor Party', 'Bachelorette Party', 'Engagement', 
  'Bridal Shower', 'Family Reunion', 'Holiday Party', 'Movie Night', 
  'Brunch', 'Concert', 'Fundraiser', 'Workshop', 'Conference', 'Retreat'
];

const FALLBACK_FONTS: Record<string, string> = {
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

const BRAND_COLORS = [
    primitives.white, primitives.cream, primitives.cobalt, primitives.midnight,
    primitives.cinnabar, primitives.sand, '#000000', '#FFD700', '#2E8B57',
    '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
];

const FONT_OPTIONS = [
    { label: 'Playfair', value: 'PlayfairDisplay-Bold' },
    { label: 'Montserrat', value: 'Montserrat-Bold' },
    { label: 'Great Vibes', value: 'GreatVibes-Regular' },
    { label: 'Oswald', value: 'Oswald-Bold' },
    { label: 'Merriweather', value: 'Merriweather-Bold' },
    { label: 'Raleway', value: 'Raleway-Bold' },
    { label: 'Poppins', value: 'Poppins_700Bold' },
];

const getTemplatesForType = (type: string) => {
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
    const generatedTemplates = [];

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

const INITIAL_TEMPLATES = getTemplatesForType('Default');

// --- REUSABLE INPUT ---
const InputWithConfirm = ({ value, onChangeText, placeholder, label }: { value: string; onChangeText: (t: string) => void; placeholder: string; label: string; }) => {
    return (
        <View className="bg-white p-4 rounded-squircle border border-brand-sand mb-4 shadow-sm relative">
            {label && <Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">{label}</Text>}
            <View className="flex-row items-center justify-between">
                <TextInput placeholder={placeholder} placeholderTextColor={`${primitives.cobalt}55`} value={value} onChangeText={onChangeText} className="text-brand-cobalt text-lg font-poppins-black flex-1 mr-2" />
                {value.length > 0 && <TouchableOpacity onPress={() => Keyboard.dismiss()}><Ionicons name="checkmark-circle" size={24} color={primitives.cobalt} /></TouchableOpacity>}
            </View>
        </View>
    );
};

// --- DRAGGABLE COMPONENT ---
const DraggableText = ({ id, element, isSelected, onSelect, onUpdatePosition, scale }: any) => {
    // Visibility Check inside Draggable
    if (element.visible === false) return null;

    const initialX = element.x ? element.x * scale : 0;
    const initialY = element.y * scale;

    const translateX = useSharedValue(initialX);
    const translateY = useSharedValue(initialY);
    const context = useSharedValue({ x: 0, y: 0 });

    useEffect(() => {
        translateX.value = element.x ? element.x * scale : 0;
        translateY.value = element.y * scale;
    }, [element.x, element.y, scale]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(onSelect)(id);
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            translateX.value = context.value.x + event.translationX;
            translateY.value = context.value.y + event.translationY;
        })
        .onEnd(() => {
            const finalX = translateX.value / scale;
            const finalY = translateY.value / scale;
            runOnJS(onUpdatePosition)(id, finalX, finalY);
        });

    const tapGesture = Gesture.Tap().onStart(() => { runOnJS(onSelect)(id); });
    const composed = Gesture.Simultaneous(tapGesture, panGesture);

    const rStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: translateX.value }, { translateY: translateY.value }] };
    });

    const fontToUse = element.fontFamily || (element.isBold ? 'Poppins_700Bold' : 'Poppins_400Regular');

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={[
                rStyle, 
                { 
                    position: 'absolute', top: 0, left: 0,
                    width: element.width ? element.width * scale : undefined,
                    alignSelf: 'flex-start',
                    borderWidth: isSelected ? 2 : 0, 
                    borderColor: primitives.cinnabar, 
                    borderStyle: 'dashed',
                    padding: 8,
                    zIndex: isSelected ? 100 : 1 
                }
            ]}>
                <Text style={{
                    fontSize: element.size * scale,
                    color: element.color,
                    fontFamily: fontToUse,
                    fontStyle: element.isItalic ? 'italic' : 'normal',
                    textDecorationLine: element.isUnderline ? 'underline' : 'none',
                    letterSpacing: element.tracking ? element.tracking * scale : 0,
                    textAlign: element.align || 'left',
                }}>
                    {element.text}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
};

export default function InviteDesigner() {
  const router = useRouter();
  const { addTask } = useData(); 
  
  const [step, setStep] = useState<'form' | 'checklist' | 'template' | 'editor'>('form');
  const [fontsReady, setFontsReady] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string>('main');
  
  // NEW: 'layers' tab added
  const [editMode, setEditMode] = useState<'style' | 'font' | 'color' | 'layers'>('style');
  const [dynamicTemplates, setDynamicTemplates] = useState<any[]>(INITIAL_TEMPLATES);

  const [canvasScale, setCanvasScale] = useState(1);
  const [stageDimensions, setStageDimensions] = useState({ width: 0, height: 0 });

  const [eventData, setEventData] = useState({
    type: 'Birthday',
    name: '', 
    date: new Date(),
    location: '', 
    isTimeTBD: false,
    useChecklist: false,
    useTimePoll: false,
    template: INITIAL_TEMPLATES[0].bg
  });

  const [designState, setDesignState] = useState({
    background: INITIAL_TEMPLATES[0].bg,
    overlayOpacity: 0.2,
    elements: {
      header: { text: 'You are invited', size: 14, color: '#fff', y: 50, x: 0, align: 'center', visible: true },
      main: { text: 'Event Name', size: 30, color: '#fff', y: 100, x: 0, align: 'center', visible: true },
      dateLabel: { text: 'Date', size: 16, color: '#fff', y: 200, x: 0, align: 'center', visible: true },
      timeLabel: { text: 'Time', size: 16, color: '#fff', y: 230, x: 0, align: 'center', visible: true },
      location: { text: 'Location', size: 14, color: '#fff', y: 260, x: 0, align: 'center', visible: true },
    } as Record<string, any>
  });

  useEffect(() => {
    async function loadFonts() {
      try {
        const fontMap: Record<string, string> = {};
        if (GOOGLE_API_KEY) {
            try {
                const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_API_KEY}&sort=popularity`);
                const data = await response.json();
                if (data.items) {
                    data.items.forEach((font: any) => {
                        const familyName = font.family.replace(/ /g, '');
                        if (['PlayfairDisplay', 'Montserrat', 'GreatVibes', 'Oswald', 'Merriweather', 'Raleway'].some(f => familyName.includes(f))) {
                            if (font.files.regular) fontMap[`${familyName}-Regular`] = font.files.regular;
                            if (font.files['700']) fontMap[`${familyName}-Bold`] = font.files['700'];
                        }
                    });
                }
            } catch (err) {}
        }
        await Font.loadAsync({ ...FALLBACK_FONTS, ...fontMap });
        setFontsReady(true);
      } catch (e) { setFontsReady(true); }
    }
    loadFonts();
  }, []);

  useEffect(() => {
      setDynamicTemplates(getTemplatesForType(eventData.type));
  }, [eventData.type]);

  useEffect(() => {
      if (stageDimensions.width > 0 && stageDimensions.height > 0) {
          const widthScale = (stageDimensions.width - 40) / 375;
          const heightScale = (stageDimensions.height - 40) / (375 * 1.5);
          setCanvasScale(Math.min(widthScale, heightScale));
      }
  }, [stageDimensions]);

  // NEW: CUSTOM IMAGE PICKER
  const pickCustomImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
      });

      if (!result.canceled) {
          // Construct date strings
          const dateStr = eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          const timeStr = eventData.isTimeTBD ? 'Time: TBD' : eventData.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

          setDesignState(prev => ({
              ...prev,
              background: result.assets[0].uri,
              overlayOpacity: 0, // Usually custom uploads need no overlay
              elements: {
                  ...prev.elements,
                  header: { ...prev.elements.header, text: eventData.type, visible: true },
                  main: { ...prev.elements.main, text: eventData.name || "Event", visible: true },
                  dateLabel: { ...prev.elements.dateLabel, text: dateStr, visible: true },
                  timeLabel: { ...prev.elements.timeLabel, text: timeStr, visible: true },
                  location: { ...prev.elements.location, text: eventData.location || "Location", visible: true }
              }
          }));
          nextStep('editor');
      }
  };

  const nextStep = (target: 'form' | 'checklist' | 'template' | 'editor') => {
    setShowDatePicker(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (target === 'template' || target === 'editor') {
        const dateStr = eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const timeStr = eventData.isTimeTBD ? 'Time: TBD' : eventData.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        setDesignState(prev => ({
            ...prev,
            elements: {
                ...prev.elements,
                header: { ...prev.elements.header, text: eventData.type, visible: true },
                main: { ...prev.elements.main, text: eventData.name || "Event Name", visible: true },
                dateLabel: { ...prev.elements.dateLabel, text: dateStr, visible: true },
                timeLabel: { ...prev.elements.timeLabel, text: timeStr, visible: true },
                location: { ...prev.elements.location, text: eventData.location || "Location", visible: true }
            }
        }));
    }
    setStep(target);
  };

  const updateElement = (key: string, updates: any) => {
    setDesignState(prev => ({
      ...prev,
      elements: { ...prev.elements, [key]: { ...prev.elements[key], ...updates } }
    }));
  };

  const updatePosition = (key: string, x: number, y: number) => {
      setDesignState(prev => ({
          ...prev,
          elements: { ...prev.elements, [key]: { ...prev.elements[key], x, y } }
      }));
  };

  const WizardHeader = () => (
    <View className="px-6 py-4 flex-row items-center justify-between border-b border-brand-sand/30">
        <TouchableOpacity onPress={() => step === 'form' ? router.back() : step === 'checklist' ? nextStep('form') : step === 'template' ? nextStep('checklist') : setStep('template')} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-brand-sand shadow-sm">
            <Ionicons name="chevron-back" size={24} color={primitives.cobalt} />
        </TouchableOpacity>
        <Text className="text-xl font-poppins-bold text-brand-cobalt">{step === 'editor' ? 'Design Studio' : 'Event Command'}</Text>
        {step === 'editor' && <TouchableOpacity onPress={() => router.push('/')}><Text className="text-brand-cinnabar font-poppins-black uppercase text-xs">Finish</Text></TouchableOpacity>}
    </View>
  );

  if (!fontsReady) return <View className="flex-1 bg-brand-cream items-center justify-center"><ActivityIndicator color={primitives.cinnabar} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <WizardHeader />
        
        {step !== 'editor' ? (
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* STEP 1: FORM */}
                {step === 'form' && (
                    <View className="p-6">
                        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 1: Core Record</Text>
                        <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowTypeDropdown(true); }} className="bg-white p-5 rounded-squircle border border-brand-sand mb-4 flex-row justify-between items-center shadow-sm">
                            <View><Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Type</Text><Text className="text-brand-cobalt font-poppins-black text-lg">{eventData.type}</Text></View>
                            <Ionicons name="chevron-down" size={20} color={primitives.cobalt} />
                        </TouchableOpacity>
                        <InputWithConfirm label="Event Name" placeholder="e.g. Harrison's 5th Birthday" value={eventData.name} onChangeText={t => setEventData(prev => ({...prev, name: t}))} />
                        <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} className="bg-white p-5 rounded-squircle border border-brand-sand mb-4 flex-row justify-between items-center shadow-sm">
                            <View><Text className="text-brand-cobalt/50 text-[10px] uppercase font-poppins-bold mb-1">Date & Time</Text><Text className="text-brand-cobalt font-poppins-black text-lg">{eventData.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text></View>
                            <Ionicons name="calendar" size={24} color={primitives.cobalt} />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <View className="bg-white rounded-squircle mb-4 p-4 border-2 border-brand-sand shadow-xl overflow-hidden">
                                <DateTimePicker value={eventData.date} mode="datetime" display={Platform.OS === 'ios' ? 'spinner' : 'default'} textColor={primitives.cobalt} onChange={(e, d) => { if (Platform.OS === 'android') setShowDatePicker(false); if (d) setEventData(prev => ({...prev, date: d})); }} />
                                <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-brand-sand/20">
                                    <View className="flex-row items-center"><Switch value={eventData.isTimeTBD} onValueChange={(v) => setEventData(p => ({...p, isTimeTBD: v}))} trackColor={{ false: primitives.sand, true: primitives.cinnabar }} /><Text className="ml-2 font-poppins-bold text-brand-cobalt text-xs">Set Time TBD</Text></View>
                                    {Platform.OS === 'ios' && <TouchableOpacity onPress={() => setShowDatePicker(false)}><Text className="text-brand-cinnabar font-poppins-black text-xs uppercase tracking-widest">Done</Text></TouchableOpacity>}
                                </View>
                            </View>
                        )}
                        <InputWithConfirm label="Location" placeholder="e.g. Celebration, FL" value={eventData.location} onChangeText={t => setEventData(prev => ({...prev, location: t}))} />
                        <TouchableOpacity onPress={() => nextStep('checklist')} className="bg-brand-cobalt py-5 rounded-2xl items-center shadow-lg mt-4"><Text className="text-white font-poppins-black uppercase tracking-widest">Next Step</Text></TouchableOpacity>
                    </View>
                )}

                {/* STEP 2: CHECKLIST */}
                {step === 'checklist' && (
                    <View className="p-6">
                        <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-6">Step 2: Utility</Text>
                        <View className="bg-brand-sand/20 p-8 rounded-squircle border border-brand-sand mb-8">
                            <View className="flex-row items-center justify-between w-full bg-white p-4 rounded-xl mb-4 border border-brand-sand">
                                <View><Text className="text-brand-cobalt font-poppins-bold text-lg">Task Ledger</Text><Text className="text-brand-cobalt/50 text-xs">Track to-dos and items</Text></View>
                                <Switch value={eventData.useChecklist} onValueChange={v => setEventData(prev => ({...prev, useChecklist: v}))} trackColor={{ false: primitives.sand, true: primitives.cinnabar }} />
                            </View>
                            <View className="flex-row items-center justify-between w-full bg-white p-4 rounded-xl border border-brand-sand">
                                <View><Text className="text-brand-cobalt font-poppins-bold text-lg">Time Poll</Text><Text className="text-brand-cobalt/50 text-xs">Let guests vote on time</Text></View>
                                <Switch value={eventData.useTimePoll} onValueChange={v => setEventData(prev => ({...prev, useTimePoll: v}))} trackColor={{ false: primitives.sand, true: primitives.cinnabar }} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => nextStep('template')} className="bg-brand-cinnabar py-5 rounded-2xl items-center shadow-lg"><Text className="text-white font-poppins-black uppercase tracking-widest">Next: Select Template</Text></TouchableOpacity>
                    </View>
                )}

                {/* STEP 3: TEMPLATES + UPLOAD */}
                {step === 'template' && (
                    <View className="p-3">
                        <View className="flex-row justify-between items-center mb-4 px-3">
                            <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest">Step 3: Theme - {eventData.type}</Text>
                            {/* NEW UPLOAD BUTTON */}
                            <TouchableOpacity onPress={pickCustomImage} className="flex-row items-center bg-brand-midnight px-3 py-1 rounded-full">
                                <Ionicons name="cloud-upload-outline" size={14} color="white" />
                                <Text className="text-white text-[10px] font-poppins-bold uppercase ml-1">Upload Own</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap justify-between">
                            {dynamicTemplates.map(style => {
                                const cardWidth = style.span === 3 ? SCREEN_WIDTH - (SPACING * 2) : (BENTO_UNIT * style.span) + (style.span > 1 ? SPACING : 0);
                                const dateStr = eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                const timeStr = eventData.isTimeTBD ? 'Time: TBD' : eventData.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                const previewElements = {
                                    header: { ...designState.elements.header, text: eventData.type, ...style.layout.header, color: style.color },
                                    main: { ...designState.elements.main, text: eventData.name || "Event", ...style.layout.main, color: style.color },
                                    dateLabel: { ...designState.elements.dateLabel, text: dateStr, ...style.layout.dateLabel, color: style.color },
                                    timeLabel: { ...designState.elements.timeLabel, text: timeStr, ...style.layout.timeLabel, color: style.color },
                                    location: { ...designState.elements.location, text: eventData.location || "Location", ...style.layout.location, color: style.color },
                                };
                                return (
                                    <TouchableOpacity key={style.id} onPress={() => { setDesignState(p => ({ ...p, background: style.bg, overlayOpacity: style.overlayOpacity || 0.1, elements: previewElements })); nextStep('editor'); }} style={{ width: cardWidth, height: style.height, marginBottom: SPACING }} className="bg-white rounded-2xl overflow-hidden border border-brand-sand shadow-sm">
                                        <InvitationRenderer elements={previewElements} backgroundUrl={style.bg} overlayOpacity={style.overlayOpacity} containerWidth={cardWidth} aspectRatio={style.height / cardWidth} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>
        ) : (
            // STEP 4: EDITOR (SPLIT VIEW)
            <View className="flex-1 bg-brand-cream">
                <View className="flex-1 items-center justify-center bg-brand-sand/10" onLayout={(e) => setStageDimensions(e.nativeEvent.layout)}>
                    {stageDimensions.width > 0 && (
                        <View style={{ 
                            width: 375 * canvasScale, height: (375 * 1.5) * canvasScale, 
                            borderRadius: 24, overflow: 'hidden', backgroundColor: 'white',
                            shadowColor: '#000', shadowOffset: {width:0, height:10}, shadowOpacity:0.2, shadowRadius:20
                        }}>
                            <ImageBackground source={{ uri: designState.background }} style={{ flex: 1 }}>
                                <View style={{ flex: 1, backgroundColor: `rgba(0,0,0, ${designState.overlayOpacity})` }}>
                                    {Object.keys(designState.elements).map(key => (
                                        <DraggableText 
                                            key={key} id={key} element={designState.elements[key]} 
                                            isSelected={selectedElement === key} onSelect={setSelectedElement} onUpdatePosition={updatePosition} 
                                            scale={canvasScale} 
                                        />
                                    ))}
                                </View>
                            </ImageBackground>
                        </View>
                    )}
                </View>

                {/* TOOL PANEL */}
                <View style={{ height: 350 }} className="bg-brand-midnight rounded-t-[32px] overflow-hidden">
                    <View className="flex-row justify-around py-4 border-b border-white/10 px-6">
                        {['style', 'font', 'color', 'layers'].map((mode: any) => (
                            <TouchableOpacity key={mode} onPress={() => setEditMode(mode)}>
                                <Text className={`font-poppins-bold uppercase text-xs ${editMode === mode ? 'text-brand-cinnabar' : 'text-white/40'}`}>{mode}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-1 px-6 pt-4">
                        {editMode === 'style' && (
                            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                                <View className="mb-6"><Text className="text-white/50 text-[10px] font-poppins-bold uppercase mb-2">Size</Text><Slider value={designState.elements[selectedElement].size} minimumValue={10} maximumValue={100} onValueChange={v => updateElement(selectedElement, { size: Math.round(v) })} minimumTrackTintColor={primitives.cinnabar} thumbTintColor={primitives.white} /></View>
                                <View className="flex-row gap-2">{['bold', 'italic', 'underline'].map(style => { const styleKey = `is${style.charAt(0).toUpperCase() + style.slice(1)}`; const isActive = designState.elements[selectedElement][styleKey]; return (<TouchableOpacity key={style} onPress={() => updateElement(selectedElement, { [styleKey]: !isActive })} className={`flex-1 items-center py-4 rounded-xl border ${isActive ? 'bg-brand-cobalt border-brand-cobalt' : 'border-white/10'}`}><MaterialCommunityIcons name={`format-${style}` as any} size={20} color="white" /></TouchableOpacity>); })}</View>
                            </ScrollView>
                        )}
                        {editMode === 'font' && (
                            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>{FONT_OPTIONS.map((font) => (<TouchableOpacity key={font.value} onPress={() => updateElement(selectedElement, { fontFamily: font.value })} className={`p-3 mb-2 rounded-xl flex-row justify-between items-center ${designState.elements[selectedElement].fontFamily === font.value ? 'bg-brand-cinnabar' : 'bg-white/5'}`}><Text style={{ fontFamily: font.value, color: 'white', fontSize: 18 }}>{font.label}</Text>{designState.elements[selectedElement].fontFamily === font.value && <Ionicons name="checkmark" size={20} color="white" />}</TouchableOpacity>))}</ScrollView>
                        )}
                        {editMode === 'color' && (
                            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}><View className="flex-row flex-wrap gap-4 justify-center">{BRAND_COLORS.map((color) => (<TouchableOpacity key={color} onPress={() => updateElement(selectedElement, { color })} style={{ backgroundColor: color }} className={`w-12 h-12 rounded-full border-2 ${designState.elements[selectedElement].color === color ? 'border-white scale-110' : 'border-white/10'}`} />))}</View></ScrollView>
                        )}
                        {/* NEW LAYERS TAB */}
                        {editMode === 'layers' && (
                            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                                {Object.keys(designState.elements).map((key) => {
                                    const el = designState.elements[key];
                                    return (
                                        <View key={key} className="flex-row items-center justify-between py-3 border-b border-white/10">
                                            <Text className="text-white font-poppins-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                                            <Switch 
                                                value={el.visible !== false} 
                                                onValueChange={(v) => updateElement(key, { visible: v })}
                                                trackColor={{ false: '#333', true: primitives.cinnabar }}
                                            />
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </View>
        )}

        <Modal animationType="fade" transparent={true} visible={showTypeDropdown} onRequestClose={() => setShowTypeDropdown(false)}>
            <TouchableOpacity activeOpacity={1} onPress={() => setShowTypeDropdown(false)} className="flex-1 bg-black/60 justify-center items-center p-6">
                <View className="bg-white w-full max-h-[70%] rounded-3xl overflow-hidden p-4">
                    <Text className="text-brand-cobalt/50 text-[10px] font-poppins-bold uppercase mb-4 text-center">Select Event Type</Text>
                    <FlatList data={EVENT_TYPES} keyExtractor={(item) => item} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<TouchableOpacity onPress={() => { setEventData(prev => ({...prev, type: item})); setShowTypeDropdown(false); }} className="py-4 border-b border-brand-sand/30"><Text className="text-brand-cobalt text-lg font-poppins-bold text-center">{item}</Text></TouchableOpacity>)} />
                </View>
            </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}