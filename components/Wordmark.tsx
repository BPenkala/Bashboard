import React from 'react';
import { Text, View } from 'react-native';
import { primitives } from '../constants/Colors'; //

interface WordmarkProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * BASHBOARD Wordmark
 * Utilizes Poppins_900Black for 'Bash' and Poppins_400Regular for 'board'
 * to anchor the Heritage Tech brand identity.
 */
export default function Wordmark({ 
  size = 24, 
  color = primitives.cobalt, 
  accentColor = primitives.cinnabar 
}: WordmarkProps) {
  return (
    <View className="flex-row items-baseline">
      <Text 
        style={{ 
          fontFamily: 'Poppins_900Black', 
          fontSize: size, 
          color: color, 
          letterSpacing: -1.5,
          textTransform: 'uppercase'
        }}
      >
        Bash
      </Text>
      <Text 
        style={{ 
          fontFamily: 'Poppins_400Regular', 
          fontSize: size * 0.95, 
          color: accentColor, 
          letterSpacing: -1,
          marginLeft: 1
        }}
      >
        board
      </Text>
    </View>
  );
}