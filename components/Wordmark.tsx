import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { theme } from '../constants/Colors';

const AnimatedLetter = ({ letter, index, size, color, font }: any) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(index * 50, withSpring(1, { damping: 8, stiffness: 120 }));
    opacity.value = withDelay(index * 50, withSpring(1));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[style, { fontFamily: font, fontSize: size, color: color, letterSpacing: -1 }]}>
      {letter}
    </Animated.Text>
  );
};

export default function Wordmark({ size = 24 }: { size?: number }) {
  const bash = "BASH".split("");
  const board = "board".split("");

  return (
    <View className="flex-row items-baseline">
      <View className="flex-row">
        {bash.map((l, i) => (
          <AnimatedLetter key={`bash-${i}`} letter={l} index={i} size={size} color={theme.ink} font="Poppins_900Black" />
        ))}
      </View>
      <View className="flex-row ml-1">
        {board.map((l, i) => (
          <AnimatedLetter key={`board-${i}`} letter={l} index={i + 4} size={size * 0.95} color={theme.primary} font="Poppins_400Regular" />
        ))}
      </View>
    </View>
  );
}