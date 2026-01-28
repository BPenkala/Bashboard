import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { theme } from '../../constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NativeInputTrayProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onDone: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  textContentType?: any;
}

export default function NativeInputTray({
  label,
  value,
  onChangeText,
  onDone,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  textContentType = 'none',
}: NativeInputTrayProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus with a slight delay to ensure the OS recognizes the transition
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    onDone();
  };

  return (
    <KeyboardAvoidingView
      // SPC FIX: behavior='padding' is most reliable for iOS when inside a root overlay.
      // On Android, the OS handles this via windowSoftInputMode, so we leave it undefined.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // This offset ensures the tray doesn't get pushed too far up or covered.
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        {/* TOP AFFORDANCE: Drag-like bar */}
        <View style={styles.dragBar} />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.labelGroup}>
            <Text style={styles.label}>{label}</Text>
          </View>
          <TouchableOpacity onPress={handleDone} style={styles.doneButton} activeOpacity={0.7}>
            <Text style={styles.doneText}>Commit</Text>
            <Ionicons name="checkmark" size={16} color="#FFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* INPUT AREA */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(29, 31, 38, 0.2)"
            multiline={false}
            
            // SYSTEM INTELLIGENCE
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={true}
            spellCheck={true}
            textContentType={textContentType}
            returnKeyType="done"
            onSubmitEditing={handleDone}
            enablesReturnKeyAutomatically={true}
          />
          
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                onChangeText('');
                Haptics.selectionAsync();
              }} 
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={22} color="rgba(29, 31, 38, 0.15)" />
            </TouchableOpacity>
          )}
        </View>

        {/* FOOTER SPACING: Prevents the text from touching the keyboard accessory bar */}
        <View style={styles.footerSpacing} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 30,
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(29, 31, 38, 0.05)',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelGroup: {
    flexDirection: 'column',
  },
  label: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.ink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  doneText: {
    color: '#FFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.canvas,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 68, // Increased height for better visual clarity
    borderWidth: 1,
    borderColor: 'rgba(29, 31, 38, 0.03)',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22, // Larger text for the "Preview" feel
    color: theme.ink,
    height: '100%',
  },
  clearButton: {
    marginLeft: 10,
  },
  footerSpacing: {
    height: 10, // Explicit gap between input and keyboard
  }
});