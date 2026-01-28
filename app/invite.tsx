import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { saveInvitation, isSaving, eventDetails, setEventDetails, designerState, setDesignerState } = useData();
  const [step, setStep] = useState<InviteStep>('details');

  // SPC LOGIC: Hydrate the empty canvas with data from the form
  const hydrateDesign = (backgroundUri?: string) => {
    setDesignerState((prev: any) => {
        // If elements already exist (e.g. from a template), just update bg
        if (Object.keys(prev.elements || {}).length > 0) {
            return backgroundUri ? { ...prev, background: backgroundUri } : prev;
        }

        // Otherwise, create default text elements from Event Details
        return {
            background: backgroundUri || prev.background,
            elements: {
                title: { 
                    text: eventDetails.name || 'Event Title', 
                    x: 40, y: 100, 
                    size: 32, fontFamily: 'Poppins_700Bold', 
                    color: '#1D1F26', align: 'center', width: 250 
                },
                details: { 
                    text: `${eventDetails.date.toLocaleDateString()} • ${eventDetails.location}`, 
                    x: 40, y: 160, 
                    size: 16, fontFamily: 'Poppins_500Medium', 
                    color: '#1D1F26', align: 'center', width: 250 
                }
            }
        };
    });
  };

  const handleFinish = useCallback(async () => {
    haptics.notification('success');
    const result = await saveInvitation();
    
    if (result.success) {
      Alert.alert("Success!", "Invitation saved.", [
        { text: "Dashboard", onPress: () => router.replace('/') }
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to save");
    }
  }, [saveInvitation, router, haptics]);

  const renderStep = () => {
    switch (step) {
      case 'details':
        return (
          <EventForm 
            eventData={eventDetails} 
            setEventData={setEventDetails} 
            onNext={() => setStep('choice')} 
            onBack={() => router.back()}
          />
        );
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
            eventData={eventDetails}
            setDesignState={(newState: any) => {
                // If template provides state, use it, but potentially merge text?
                // For now, assume template sets background and we hydrate text if missing
                setDesignerState(newState);
                hydrateDesign(); // Ensure text exists
            }}
            onNext={() => setStep('editor')} 
            onBack={() => setStep('choice')} 
          />
        );
      case 'upload':
        return (
          <BackgroundPicker 
            onImageSelected={(uri) => {
                hydrateDesign(uri); // Inject text + bg
                setStep('editor');
            }} 
            onBack={() => setStep('choice')} 
          />
        );
      case 'editor':
        return (
          <EditorStage 
            designState={designerState}
            setDesignState={setDesignerState}
            onFinish={handleFinish}
            onBack={() => setStep('choice')} 
          />
        );
      default:
        return (
          <EventForm 
            eventData={eventDetails} 
            setEventData={setEventDetails} 
            onNext={() => setStep('choice')} 
            onBack={() => router.back()}
          />
        );
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  }
});