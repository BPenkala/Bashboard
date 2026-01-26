import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, FadeOut, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { theme } from '../constants/Colors';
import Wordmark from './Wordmark';

export default function AppLoader({ onFinished }: { onFinished: () => void }) {
  const progress = useSharedValue(0);
  const frameRotate = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    frameRotate.value = withTiming(360, { duration: 2200 });
    const timer = setTimeout(onFinished, 2800);
    return () => clearTimeout(timer);
  }, [onFinished, progress, frameRotate]);

  // [LDEV] Corrected: Removed `.value` access in inline styles by using hooks properly
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 0.7, 1], [theme.ink, theme.ink, theme.canvas])
  }));

  const frameStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${frameRotate.value}deg` }, 
      { scale: interpolate(progress.value, [0, 0.5, 1], [0.8, 1.3, 0]) }
    ],
    opacity: interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.85, 1], [0, 0, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 0.85, 1], [10, 10, 0]) }]
  }));

  return (
    <Animated.View exiting={FadeOut.duration(800)} style={[StyleSheet.absoluteFill, bgStyle, styles.container]}>
      <Animated.View 
        style={[frameStyle, { borderWidth: 2, borderColor: theme.primary, borderRadius: 50, width: 260, height: 260, position: 'absolute' }]} 
      />
      <Animated.View style={contentStyle}><Wordmark size={48} /></Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { zIndex: 9999, alignItems: 'center', justifyContent: 'center' },
});