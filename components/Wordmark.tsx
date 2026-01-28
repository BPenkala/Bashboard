import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WordmarkProps {
  color?: string;
  size?: number;
}

export default function Wordmark({ color = '#1D1F26', size = 24 }: WordmarkProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color, fontSize: size }]}>
        bash
        <Text style={styles.bold}>board</Text>
      </Text>
      <View style={[styles.dot, { backgroundColor: color, width: size / 6, height: size / 6 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  text: {
    // SPC FIX: Explicitly calling the Poppins weight loaded in _layout.tsx
    fontFamily: 'Poppins_400Regular',
    letterSpacing: -0.5,
  },
  bold: {
    fontFamily: 'Poppins_700Bold',
  },
  dot: {
    marginLeft: 2,
    borderRadius: 99,
  },
});