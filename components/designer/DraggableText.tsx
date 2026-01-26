import * as Haptics from 'expo-haptics';
import React, { memo, useEffect } from 'react';
import { Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const DraggableText = memo(({ id, element, isSelected, onSelect, onUpdatePosition, scale, canvasWidth }: any) => {
    if (!element || element.visible === false) return null;

    const safeX = (element.x ?? 0) * scale;
    const safeY = (element.y ?? 0) * scale;

    const translateX = useSharedValue(safeX);
    const translateY = useSharedValue(safeY);
    const context = useSharedValue({ x: 0, y: 0 });

    useEffect(() => {
        translateX.value = withSpring((element.x ?? 0) * scale);
        translateY.value = withSpring((element.y ?? 0) * scale);
    }, [element.x, element.y, scale]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(onSelect)(id);
            context.value = { x: translateX.value, y: translateY.value };
            // [QA] Native calls must be wrapped in runOnJS
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        })
        .onUpdate((event) => {
            const nextX = context.value.x + (event.translationX ?? 0);
            const nextY = context.value.y + (event.translationY ?? 0);

            const elWidth = (element.width ?? 100) * scale;
            const centerX = (canvasWidth / 2) - (elWidth / 2);
            
            if (Math.abs(nextX - centerX) < 5) {
                translateX.value = centerX;
                runOnJS(Haptics.selectionAsync)();
            } else {
                translateX.value = nextX;
            }
            translateY.value = nextY;
        })
        .onEnd(() => {
            runOnJS(onUpdatePosition)(id, translateX.value / (scale || 1), translateY.value / (scale || 1));
        });

    const tapGesture = Gesture.Tap().onStart(() => { runOnJS(onSelect)(id); });
    const composed = Gesture.Simultaneous(tapGesture, panGesture);

    // [QA] Moved zIndex and borderWidth here to silence Reanimated warnings
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
        zIndex: isSelected ? 100 : 1,
        borderWidth: isSelected ? 1 : 0,
    }));

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={[
                animatedStyle, 
                { 
                    position: 'absolute', top: 0, left: 0,
                    width: element.width ? element.width * scale : undefined,
                    borderColor: '#88A2F2', 
                    borderStyle: 'dashed',
                    padding: 4,
                }
            ]}>
                <Text style={{
                    fontSize: (element.size ?? 20) * scale,
                    color: element.color ?? '#FFFFFF',
                    fontFamily: element.fontFamily ?? 'Poppins_700Bold',
                    textAlign: element.align ?? 'center',
                    textTransform: element.uppercase ? 'uppercase' : 'none',
                    letterSpacing: (element.tracking ?? 0) * scale,
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3
                }}>
                    {element.text}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
});

export default DraggableText;