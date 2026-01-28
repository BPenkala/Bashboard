import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function BentoKeyboard({ onKeyPress, onDelete, onClose }: any) {
  const [isShift, setIsShift] = useState(false);

  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKeyPress(isShift ? key : key.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.doneText}>Done</Text></TouchableOpacity>
      </View>
      <View style={styles.keyboardBody}>
        {KEYS.map((row, i) => (
          <View key={i} style={styles.row}>
            {i === 2 && (
              <TouchableOpacity onPress={() => setIsShift(!isShift)} style={[styles.key, styles.specialKey, isShift && { backgroundColor: theme.primary }]}>
                <Ionicons name="arrow-up" size={20} color={isShift ? '#FFF' : theme.ink} />
              </TouchableOpacity>
            )}
            {row.map(key => (
              <TouchableOpacity key={key} onPress={() => handlePress(key)} style={styles.key}>
                <Text style={styles.keyText}>{isShift ? key : key.toLowerCase()}</Text>
              </TouchableOpacity>
            ))}
            {i === 2 && (
              <TouchableOpacity onPress={onDelete} style={[styles.key, styles.specialKey]}><Ionicons name="backspace-outline" size={20} color={theme.ink} /></TouchableOpacity>
            )}
          </View>
        ))}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handlePress(' ')} style={[styles.key, { flex: 0, width: width * 0.6 }]}><Text style={styles.keyText}>space</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingBottom: 40, elevation: 20 },
  header: { padding: 20, alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  doneText: { color: theme.primary, fontFamily: 'Poppins_700Bold', fontSize: 14, textTransform: 'uppercase' },
  keyboardBody: { padding: 10, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  key: { flex: 1, height: 48, backgroundColor: theme.canvas, borderRadius: 14, justifyContent: 'center', alignItems: 'center', minWidth: (width - 80) / 10 },
  keyText: { fontFamily: 'Poppins_500Medium', fontSize: 18, color: theme.ink },
  specialKey: { backgroundColor: 'rgba(136, 162, 242, 0.15)', flex: 1.5 }
});