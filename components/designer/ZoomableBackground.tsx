import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function ZoomableBackground({ source, children }: any) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // [HCI] Pinch Gesture with Boundary Clamping
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // Logic: scale = original * change. 
      // Minimum scale is 1 to ensure the canvas is always filled.
      const nextScale = savedScale.value * e.scale;
      scale.value = nextScale < 1 ? 1 : nextScale; 
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <View style={styles.container}>
        <Animated.Image 
          source={{ uri: source }} 
          style={[styles.image, animatedStyle]} 
          resizeMode="cover" 
        />
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  image: { width: '100%', height: '100%' }
});