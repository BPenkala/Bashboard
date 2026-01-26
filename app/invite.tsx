import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, LayoutAnimation, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditorStage from '../components/designer/EditorStage';
import EventForm from '../components/designer/EventForm';
import TemplateSelector from '../components/designer/TemplateSelector';
import UtilityChecklist from '../components/designer/UtilityChecklist';

import { theme } from '../constants/Colors';
import { FALLBACK_FONTS, INITIAL_TEMPLATES } from '../constants/DesignerConstants';

export default function InviteDesigner() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'checklist' | 'template' | 'editor'>('form');
  const [fontsReady, setFontsReady] = useState(false);

  const [eventData, setEventData] = useState({
    type: 'Birthday', name: '', date: new Date(), time: new Date(), location: '', isTimeTBD: false, useChecklist: false, useTimePoll: false,
  });

  const [designState, setDesignState] = useState({
    background: INITIAL_TEMPLATES[0].bg,
    overlayOpacity: 0.2,
    elements: {
      header: { text: 'You are invited', size: 14, color: theme.white, y: 50, x: 0, align: 'center', visible: true },
      main: { text: 'Event Name', size: 30, color: theme.white, y: 100, x: 0, align: 'center', visible: true },
    } as Record<string, any>
  });

  // [LDEV] TIER 2: Batch load the creative font bundle.
  useEffect(() => {
    async function loadCreativeFonts() {
      try {
        await Font.loadAsync(FALLBACK_FONTS);
      } catch (e) {
        console.warn('Creative fonts failed to load:', e);
      } finally {
        setFontsReady(true);
      }
    }
    loadCreativeFonts();
  }, []);

  const nextStep = (target: typeof step) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(target);
  };

  if (!fontsReady) return <View className="flex-1 bg-canvas items-center justify-center"><ActivityIndicator size="large" color={theme.primary} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-canvas">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-ink/5">
            <TouchableOpacity onPress={() => step === 'form' ? router.back() : nextStep('form')}>
                <Ionicons name="chevron-back" size={24} color={theme.ink} />
            </TouchableOpacity>
            <Text className="text-xl font-poppins-bold text-ink">{step === 'editor' ? 'Design Studio' : 'Host an Event'}</Text>
            {step === 'editor' && <TouchableOpacity onPress={() => router.push('/')}><Text className="text-primary font-poppins-black uppercase text-xs">Finish</Text></TouchableOpacity>}
        </View>
        
        {step === 'form' && <EventForm eventData={eventData} setEventData={setEventData} onNext={() => nextStep('checklist')} />}
        {step === 'checklist' && <UtilityChecklist eventData={eventData} setEventData={setEventData} onNext={() => nextStep('template')} />}
        {step === 'template' && <TemplateSelector eventData={eventData} setDesignState={setDesignState} onNext={() => nextStep('editor')} />}
        {step === 'editor' && <EditorStage designState={designState} setDesignState={setDesignState} />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}