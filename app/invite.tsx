import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundPicker from '../components/designer/BackgroundPicker';
import ChoiceStage from '../components/designer/ChoiceStage';
import EditorStage from '../components/designer/EditorStage';
import EventForm from '../components/designer/EventForm';
import TemplateSelector from '../components/designer/TemplateSelector';
import { theme } from '../constants/Colors';
import { LAYOUT_MANIFESTS } from '../constants/DesignerConstants';

export default function InviteScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({ name: '', type: 'Birthday', location: '', date: new Date(), time: new Date() });
  const [designState, setDesignState] = useState({ background: '', elements: {} });

  const handleChoice = (choice: 'template' | 'scratch') => {
    if (choice === 'scratch') setStep(2.5);
    else setStep(3);
  };

  const handleLocalImage = (uri: string) => {
    setDesignState({
      background: uri,
      elements: JSON.parse(JSON.stringify(LAYOUT_MANIFESTS.modern.elements))
    });
    setStep(4);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.canvas }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {step === 1 && <EventForm eventData={eventData} setEventData={setEventData} onNext={() => setStep(2)} onBack={() => router.back()} />}
        {step === 2 && <ChoiceStage onSelect={handleChoice} onBack={() => setStep(1)} />}
        {step === 2.5 && <BackgroundPicker onImageSelected={handleLocalImage} onBack={() => setStep(2)} />}
        {step === 3 && <TemplateSelector eventData={eventData} setDesignState={setDesignState} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <EditorStage designState={designState} setDesignState={setDesignState} onBack={() => setStep(designState.background.startsWith('file://') ? 2.5 : 3)} />}
      </View>
    </SafeAreaView>
  );
}