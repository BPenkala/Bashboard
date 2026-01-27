import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import BackgroundPicker from '../components/designer/BackgroundPicker';
import ChoiceStage from '../components/designer/ChoiceStage';
import EditorStage from '../components/designer/EditorStage';
import EventForm from '../components/designer/EventForm';
import TemplateSelector from '../components/designer/TemplateSelector';
import Colors from '../constants/Colors';
import { useData } from '../context/DataContext';
import { useHaptics } from '../hooks/useHaptics';

type InviteStep = 'details' | 'choice' | 'templates' | 'upload' | 'editor';

export default function InviteScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { saveInvitation, isSaving } = useData();
  const [step, setStep] = useState<InviteStep>('details');

  const handleFinish = useCallback(async () => {
    haptics.notification('success');
    const result = await saveInvitation();
    
    if (result.success) {
      Alert.alert("Success!", "Your invitation has been saved to your Bashboard.", [
        { text: "View Dashboard", onPress: () => router.replace('/') }
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to save invitation");
    }
  }, [saveInvitation, router, haptics]);

  const renderStep = () => {
    switch (step) {
      case 'details':
        return <EventForm onNext={() => setStep('choice')} />;
      case 'choice':
        return (
          <ChoiceStage 
            onSelectTemplate={() => setStep('templates')} 
            onSelectUpload={() => setStep('upload')}
            onBack={() => setStep('details')}
          />
        );
      case 'templates':
        return (
          <TemplateSelector 
            onNext={() => setStep('editor')} 
            onBack={() => setStep('choice')} 
          />
        );
      case 'upload':
        return (
          <BackgroundPicker 
            onNext={() => setStep('editor')} 
            onBack={() => setStep('choice')} 
          />
        );
      case 'editor':
        return (
          <EditorStage 
            onFinish={handleFinish} 
            onBack={() => setStep('choice')} 
          />
        );
      default:
        return <EventForm onNext={() => setStep('choice')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      )}
      <View style={styles.content}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  }
});