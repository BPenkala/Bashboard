import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// KEY LAYOUT DEFINITIONS
const ALPHA_KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const NUM_KEYS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['.', ',', '?', '!', "'"]
];

const SYM_KEYS = [
  ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
  ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
  ['.', ',', '?', '!', "'"]
];

interface BentoKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onClose: () => void;
  currentValue: string;
  label: string;
}

type KeyboardMode = 'ALPHA' | 'NUMERIC' | 'SYMBOL';

export default function BentoKeyboard({ onKeyPress, onDelete, onClear, onClose, currentValue, label }: BentoKeyboardProps) {
  const [mode, setMode] = useState<KeyboardMode>('ALPHA');
  const [isShift, setIsShift] = useState(true);
  const cursorOpacity = useRef(new Animated.Value(0)).current;

  // Auto-cap logic
  useEffect(() => {
    if (currentValue.length === 0) setIsShift(true);
  }, [currentValue]);

  // Cursor Animation
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const char = (mode === 'ALPHA' && !isShift) ? key.toLowerCase() : key;
    onKeyPress(char);
    
    if (isShift && key !== ' ' && mode === 'ALPHA') {
      setIsShift(false);
    }
  };

  const toggleMode = () => {
    Haptics.selectionAsync();
    if (mode === 'ALPHA') setMode('NUMERIC');
    else if (mode === 'NUMERIC') setMode('ALPHA');
    else setMode('NUMERIC');
  };

  const toggleSymbols = () => {
    Haptics.selectionAsync();
    setMode(mode === 'SYMBOL' ? 'NUMERIC' : 'SYMBOL');
  };

  const getKeys = () => {
    if (mode === 'ALPHA') return ALPHA_KEYS;
    if (mode === 'SYMBOL') return SYM_KEYS;
    return NUM_KEYS;
  };

  return (
    <View style={styles.container}>
      {/* INPUT TRAY */}
      <View style={styles.inputTray}>
        <View style={styles.trayHeader}>
            <Text style={styles.trayLabel}>{label}</Text>
            <View style={styles.trayActions}>
                {currentValue.length > 0 && (
                    <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose} style={styles.doneButton}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.previewContainer}>
            <Text style={[styles.previewText, !currentValue && styles.previewPlaceholder]}>
                {currentValue || `Enter ${label.toLowerCase()}...`}
            </Text>
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </View>
      </View>

      {/* KEYBOARD BODY */}
      <View style={styles.keyboardBody}>
        {getKeys().map((row, i) => (
          <View key={i} style={styles.row}>
            {/* Left Special Keys (Shift or #+=) */}
            {i === 2 && mode === 'ALPHA' && (
              <TouchableOpacity 
                onPress={() => { setIsShift(!isShift); Haptics.selectionAsync(); }} 
                style={[styles.key, styles.sideKey, isShift && { backgroundColor: theme.primary }]}
              >
                <Ionicons name="arrow-up" size={22} color={isShift ? '#FFF' : theme.ink} />
              </TouchableOpacity>
            )}
            {i === 2 && mode !== 'ALPHA' && (
              <TouchableOpacity 
                onPress={toggleSymbols} 
                style={[styles.key, styles.sideKey]}
              >
                <Text style={styles.modeText}>{mode === 'NUMERIC' ? '#+=' : '123'}</Text>
              </TouchableOpacity>
            )}

            {row.map(key => (
              <TouchableOpacity
                key={key}
                activeOpacity={0.5}
                onPress={() => handlePress(key)}
                style={styles.key}
              >
                <Text style={styles.keyText}>
                  {mode === 'ALPHA' && !isShift ? key.toLowerCase() : key}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Backspace Key */}
            {i === 2 && (
              <TouchableOpacity 
                onPress={() => { onDelete(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} 
                style={[styles.key, styles.sideKey]}
              >
                <Ionicons name="backspace-outline" size={24} color={theme.ink} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* BOTTOM ROW */}
        <View style={styles.row}>
          <TouchableOpacity onPress={toggleMode} style={[styles.key, styles.modeToggleKey]}>
            <Text style={styles.modeText}>{mode === 'ALPHA' ? '123' : 'ABC'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handlePress(' ')} style={[styles.key, styles.spaceKey]}>
            <Text style={styles.keyText}>space</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.key, styles.modeToggleKey]}>
            <Ionicons name="return-down-back" size={22} color={theme.ink} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.canvas,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 40,
    elevation: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
  },
  inputTray: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trayLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 9,
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  trayActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  clearButton: { padding: 4 },
  clearText: { color: 'rgba(29, 31, 38, 0.2)', fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  doneButton: { backgroundColor: theme.ink, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  doneText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 11 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  previewText: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, color: theme.ink },
  previewPlaceholder: { color: 'rgba(29, 31, 38, 0.1)' },
  cursor: { width: 2.5, height: 26, backgroundColor: theme.primary, marginLeft: 4 },
  keyboardBody: {
    padding: 6, // Reduced padding to allow larger keys
    gap: 6,     // Tighter gaps
  },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 4 }, // Minimized gaps
  key: {
    flex: 1,
    height: 56, // Increased height for better ergonomics
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: (width - 60) / 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  keyText: { fontFamily: 'Poppins_500Medium', fontSize: 20, color: theme.ink },
  sideKey: { backgroundColor: 'rgba(136, 162, 242, 0.12)', flex: 1.4 },
  modeToggleKey: { backgroundColor: 'rgba(29, 31, 38, 0.05)', flex: 1.8 },
  modeText: { fontFamily: 'Poppins_700Bold', fontSize: 13, color: theme.ink },
  spaceKey: { flex: 5 },
});