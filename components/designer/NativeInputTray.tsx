import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// SPC FIX: Corrected import source for keyboard handler
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, {
    Easing,
    SlideInDown,
    SlideOutDown,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { theme } from '../../constants/Colors';

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
  const keyboardHeight = useSharedValue(0);

  // SPC PERFORMANCE: Lock movement to UI thread for zero-jitter
  useKeyboardHandler({
    onMove: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
    onEnd: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // Moves in exact sync with keyboard height
      transform: [{ translateY: -keyboardHeight.value + 60 }],
    };
  });

  useEffect(() => {
    // Focus timing calibrated for the 250ms crisp entry
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200); 
    return () => clearTimeout(timer);
  }, []);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    onDone();
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View 
        style={[styles.container, animatedStyle]}
        // Crisp, subtle entry without spring/bounce
        entering={SlideInDown.duration(250).easing(Easing.out(Easing.quad))}
        exiting={SlideOutDown.duration(200)}
      >
        <View style={styles.dragBar} />

        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity onPress={handleDone} style={styles.doneButton} activeOpacity={0.7}>
            <Text style={styles.doneText}>Save</Text>
            <Ionicons name="checkmark" size={16} color="#FFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(29, 31, 38, 0.2)"
            multiline={false}
            autoCorrect={true}
            spellCheck={true}
            textContentType={textContentType}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            returnKeyType="done"
            onSubmitEditing={handleDone}
            enablesReturnKeyAutomatically={true}
          />
          
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => { onChangeText(''); Haptics.selectionAsync(); }} 
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={22} color="rgba(29, 31, 38, 0.15)" />
            </TouchableOpacity>
          )}
        </View>

        {/* HIGH-CLEARANCE BUFFER: Pushes the input ABOVE the QuickType/Accessory bar */}
        <View style={styles.bottomBuffer} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 35,
  },
  dragBar: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(29, 31, 38, 0.05)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
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
  doneText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 13 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.canvas,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(29, 31, 38, 0.02)',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: theme.ink,
    height: '100%',
  },
  clearButton: { marginLeft: 10 },
  bottomBuffer: {
    // Ensures the input clears the native accessory bar height (QuickType)
    height: Platform.OS === 'ios' ? 50 : 10, 
  }
});