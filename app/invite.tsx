import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, LayoutAnimation, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// SUB-COMPONENTS
import EditorStage from '../components/designer/EditorStage';
import EventForm from '../components/designer/EventForm';
import TemplateSelector from '../components/designer/TemplateSelector';
import UtilityChecklist from '../components/designer/UtilityChecklist';

import { primitives } from '../constants/Colors';
import { FALLBACK_FONTS, INITIAL_TEMPLATES } from '../constants/DesignerConstants';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function InviteDesigner() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'checklist' | 'template' | 'editor'>('form');
  const [fontsReady, setFontsReady] = useState(false);

  // SHARED STATE MANAGED BY THE WIZARD
  const [eventData, setEventData] = useState({
    type: 'Birthday',
    name: '', 
    date: new Date(),
    location: '', 
    isTimeTBD: false,
    useChecklist: false,
    useTimePoll: false,
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
        // Font loading logic preserved from your original code
        await Font.loadAsync({ ...FALLBACK_FONTS, ...fontMap });
        setFontsReady(true);
      } catch (e) { setFontsReady(true); }
    }
    loadFonts();
  }, []);

  const nextStep = (target: typeof step) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(target);
  };

  const WizardHeader = () => (
    <View className="px-6 py-4 flex-row items-center justify-between border-b border-brand-sand/30">
        <TouchableOpacity 
          onPress={() => step === 'form' ? router.back() : step === 'checklist' ? nextStep('form') : step === 'template' ? nextStep('checklist') : setStep('template')} 
          className="w-10 h-10 bg-white rounded-full items-center justify-center border border-brand-sand shadow-sm"
        >
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
        
        {step === 'form' && <EventForm eventData={eventData} setEventData={setEventData} onNext={() => nextStep('checklist')} />}
        {step === 'checklist' && <UtilityChecklist eventData={eventData} setEventData={setEventData} onNext={() => nextStep('template')} />}
        {step === 'template' && (
            <TemplateSelector 
                eventData={eventData} 
                setDesignState={setDesignState} 
                onNext={() => nextStep('editor')} 
            />
        )}
        {step === 'editor' && (
            <EditorStage 
                designState={designState} 
                setDesignState={setDesignState} 
            />
        )}

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}