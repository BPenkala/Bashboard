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

export default function InviteDesigner() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'checklist' | 'template' | 'editor'>('form');
  const [fontsReady, setFontsReady] = useState(false);

  // SHARED STATE: Split Date and Time for better UX
  const [eventData, setEventData] = useState({
    type: 'Birthday',
    name: '', 
    date: new Date(),
    time: new Date(),
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
        await Font.loadAsync({ ...FALLBACK_FONTS });
        setFontsReady(true);
      } catch (e) { setFontsReady(true); }
    }
    loadFonts();
  }, []);

  const nextStep = (target: typeof step) => {
    // SYNC LOGIC: Push event form data into the design elements
    if (target === 'template' || target === 'editor') {
      const dateStr = eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = eventData.isTimeTBD ? 'TBD' : eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      setDesignState(prev => ({
        ...prev,
        elements: {
          ...prev.elements,
          header: { ...prev.elements.header, text: eventData.type },
          main: { ...prev.elements.main, text: eventData.name || "Event Name" },
          dateLabel: { ...prev.elements.dateLabel, text: dateStr },
          timeLabel: { ...prev.elements.timeLabel, text: timeStr },
          location: { ...prev.elements.location, text: eventData.location || "Location" },
        }
      }));
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(target);
  };

  if (!fontsReady) return <View className="flex-1 bg-brand-cream items-center justify-center"><ActivityIndicator color={primitives.cinnabar} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-brand-sand/30">
            <TouchableOpacity onPress={() => step === 'form' ? router.back() : step === 'checklist' ? nextStep('form') : step === 'template' ? nextStep('checklist') : setStep('template')}>
                <Ionicons name="chevron-back" size={24} color={primitives.cobalt} />
            </TouchableOpacity>
            <Text className="text-xl font-poppins-bold text-brand-cobalt">{step === 'editor' ? 'Design Studio' : 'Event Command'}</Text>
            {step === 'editor' && <TouchableOpacity onPress={() => router.push('/')}><Text className="text-brand-cinnabar font-poppins-black uppercase text-xs">Finish</Text></TouchableOpacity>}
        </View>
        
        {step === 'form' && <EventForm eventData={eventData} setEventData={setEventData} onNext={() => nextStep('checklist')} />}
        {step === 'checklist' && <UtilityChecklist eventData={eventData} setEventData={setEventData} onNext={() => nextStep('template')} />}
        {step === 'template' && <TemplateSelector eventData={eventData} setDesignState={setDesignState} onNext={() => nextStep('editor')} />}
        {step === 'editor' && <EditorStage designState={designState} setDesignState={setDesignState} />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}