import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// 1. TYPO DICTIONARY (Expandable)
const COMMON_TYPOS: Record<string, string> = {
  'teh': 'the', 'nad': 'and', 'wont': "won't", 'dont': "don't",
  'im': "I'm", 'cant': "can't", 'ill': "I'll", 'ive': "I've",
  'sunday': 'Sunday', 'monday': 'Monday', 'tuesday': 'Tuesday',
  'wednesday': 'Wednesday', 'thursday': 'Thursday', 'friday': 'Friday', 'saturday': 'Saturday',
  'january': 'January', 'february': 'February', 'march': 'March', 'april': 'April',
  'may': 'May', 'june': 'June', 'july': 'July', 'august': 'August', 'september': 'September',
  'october': 'October', 'november': 'November', 'december': 'December'
};

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
  
  // 2. OPTIMISTIC STATE: Instant visual feedback before parent updates
  const [optimisticValue, setOptimisticValue] = useState(currentValue);
  const cursorOpacity = useRef(new Animated.Value(0)).current;

  // Sync prop changes (e.g. initial load or external reset) to local state
  useEffect(() => {
    setOptimisticValue(currentValue);
  }, [currentValue]);

  // Auto-Capitalization Logic
  useEffect(() => {
    if (optimisticValue.length === 0) {
      setIsShift(true);
    } else if (optimisticValue.length >= 2 && optimisticValue.slice(-2) === '. ') {
      setIsShift(true);
    }
  }, [optimisticValue]);

  // Cursor Blinking
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

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePress = (key: string) => {
    let nextValue = optimisticValue;
    let charToAdd = key;

    // A. SMART PUNCTUATION: Double Space -> Period
    if (key === ' ' && nextValue.endsWith(' ')) {
      // Remove last space, add period+space
      const trimVal = nextValue.slice(0, -1);
      nextValue = trimVal + '. ';
      
      // Update Parent (Complex Delete + Add)
      onDelete(); 
      onKeyPress('. '); 
      
      setOptimisticValue(nextValue);
      setIsShift(true);
      return;
    }

    // B. AUTO-CORRECT (SymSpell-Lite)
    if (key === ' ') {
      const words = nextValue.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();
      if (COMMON_TYPOS[lastWord]) {
        // Replace the typo in optimistic state
        const corrected = COMMON_TYPOS[lastWord];
        const base = nextValue.slice(0, -lastWord.length);
        nextValue = base + corrected;
        
        // We can't easily sync this complex replace to parent via simple onKeyPress
        // Ideally parent should accept `onUpdate(fullString)`.
        // For now, we mimic typing the space normally, but UI might jump if we don't fix parent.
        // *Architecture Decision*: We will just send the space for now, auto-correct is hard without `onChangeText` prop.
        // Let's assume we stick to the provided prop interface:
      }
    }

    // C. SMART QUOTES (Typographizer-Lite)
    if (key === '"' || key === "'") {
       // Logic: If previous char is space or empty, open quote. Else close quote.
       const lastChar = nextValue.slice(-1);
       const isOpen = !lastChar || lastChar === ' ';
       if (key === '"') charToAdd = isOpen ? '“' : '”';
       if (key === "'") charToAdd = isOpen ? '‘' : '’';
    } else {
       charToAdd = (mode === 'ALPHA' && !isShift) ? key.toLowerCase() : key;
    }

    // D. OPTIMISTIC UPDATE
    setOptimisticValue(prev => prev + charToAdd);
    onKeyPress(charToAdd);

    // Auto-lowercase
    if (isShift && key !== ' ' && mode === 'ALPHA') {
      setIsShift(false);
    }
  };

  const handleDeleteOptimistic = () => {
    setOptimisticValue(prev => prev.slice(0, -1));
    onDelete();
  };

  const handleClearOptimistic = () => {
    setOptimisticValue('');
    onClear();
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

  const KeyButton = ({ label, icon, onPress, isSpecial = false, style = {} }: any) => (
    <Pressable
      onPressIn={handlePressIn}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.key,
        isSpecial ? styles.specialKey : {},
        style,
        pressed && styles.keyPressed
      ]}
    >
      {({ pressed }) => (
        <>
          {/* KEY POP-UP MAGNIFIER (Visual Confirmation) */}
          {pressed && !isSpecial && (
            <View style={styles.magnifier}>
              <Text style={styles.magnifierText}>{label}</Text>
            </View>
          )}
          {icon ? (
            <Ionicons name={icon} size={22} color={isSpecial && isShift ? '#FFF' : theme.ink} />
          ) : (
            <Text style={[styles.keyText, isSpecial && styles.modeText]}>{label}</Text>
          )}
        </>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputTray}>
        <View style={styles.trayHeader}>
            <Text style={styles.trayLabel}>{label}</Text>
            <View style={styles.trayActions}>
                {optimisticValue.length > 0 && (
                    <Pressable onPress={handleClearOptimistic} hitSlop={15} style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear</Text>
                    </Pressable>
                )}
                <Pressable onPress={onClose} hitSlop={15} style={styles.doneButton}>
                    <Text style={styles.doneText}>Done</Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.previewContainer}>
            <Text style={[styles.previewText, !optimisticValue && styles.previewPlaceholder]}>
                {optimisticValue || `Enter ${label.toLowerCase()}...`}
            </Text>
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </View>
      </View>

      <View style={styles.keyboardBody}>
        {getKeys().map((row, i) => (
          <View key={i} style={styles.row}>
            {i === 2 && (
                mode === 'ALPHA' ? (
                    <KeyButton 
                        icon="arrow-up" 
                        isSpecial={true}
                        style={[styles.sideKey, isShift && { backgroundColor: theme.primary }]}
                        onPress={() => { setIsShift(!isShift); }}
                    />
                ) : (
                    <KeyButton 
                        label={mode === 'NUMERIC' ? '#+=' : '123'}
                        isSpecial={true}
                        style={styles.sideKey}
                        onPress={toggleSymbols}
                    />
                )
            )}

            {row.map(key => (
              <KeyButton 
                key={key} 
                label={mode === 'ALPHA' && !isShift ? key.toLowerCase() : key}
                onPress={() => handlePress(key)}
              />
            ))}

            {i === 2 && (
              <KeyButton 
                icon="backspace-outline"
                isSpecial={true}
                style={styles.sideKey}
                onPress={handleDeleteOptimistic}
              />
            )}
          </View>
        ))}

        <View style={styles.row}>
          <KeyButton 
            label={mode === 'ALPHA' ? '123' : 'ABC'}
            isSpecial={true}
            style={styles.modeToggleKey}
            onPress={toggleMode}
          />
          <KeyButton 
            label="space"
            style={styles.spaceKey}
            onPress={() => handlePress(' ')}
          />
          <KeyButton 
            icon="return-down-back"
            isSpecial={true}
            style={styles.modeToggleKey}
            onPress={onClose}
          />
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trayLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  trayActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clearButton: { padding: 4 },
  clearText: { color: 'rgba(29, 31, 38, 0.3)', fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  doneButton: { backgroundColor: theme.ink, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  doneText: { color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 12 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  previewText: { fontFamily: 'Poppins_600SemiBold', fontSize: 26, color: theme.ink, letterSpacing: -0.5 },
  previewPlaceholder: { color: 'rgba(29, 31, 38, 0.1)' },
  cursor: { width: 3, height: 28, backgroundColor: theme.primary, marginLeft: 4, borderRadius: 1.5 },
  keyboardBody: { padding: 6, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  key: {
    flex: 1,
    height: 58,
    backgroundColor: '#FFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: (width - 60) / 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    zIndex: 1,
  },
  keyPressed: {
    backgroundColor: '#E8EAF0',
    transform: [{ scale: 0.95 }],
  },
  magnifier: {
    position: 'absolute',
    bottom: 50,
    width: 60,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 999,
  },
  magnifierText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 32,
    color: theme.ink,
  },
  keyText: { fontFamily: 'Poppins_500Medium', fontSize: 21, color: theme.ink },
  specialKey: { backgroundColor: 'rgba(136, 162, 242, 0.12)', flex: 1.4 },
  sideKey: { backgroundColor: '#F2F2F2', flex: 1.4 },
  modeToggleKey: { backgroundColor: '#F2F2F2', flex: 1.5 },
  modeText: { fontFamily: 'Poppins_700Bold', fontSize: 13, color: theme.ink },
  spaceKey: { flex: 4 },
});