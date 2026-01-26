import React, { memo, useEffect } from 'react';
import { Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const DraggableText = memo(({ id, element, isSelected, onSelect, onUpdatePosition, scale }: any) => {
    if (element.visible === false) return null;

    // Use shared values strictly for animation properties
    const translateX = useSharedValue(element.x ? element.x * scale : 0);
    const translateY = useSharedValue(element.y * scale);
    const context = useSharedValue({ x: 0, y: 0 });

    // Sync position when element props update (e.g., from template switch)
    useEffect(() => {
        translateX.value = element.x ? element.x * scale : 0;
        translateY.value = element.y * scale;
    }, [element.x, element.y, scale, translateX, translateY]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(onSelect)(id);
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            translateX.value = context.value.x + event.translationX;
            translateY.value = context.value.y + event.translationY;
        })
        .onEnd(() => {
            const finalX = translateX.value / scale;
            const finalY = translateY.value / scale;
            runOnJS(onUpdatePosition)(id, finalX, finalY);
        });

    const tapGesture = Gesture.Tap().onStart(() => { runOnJS(onSelect)(id); });
    const composed = Gesture.Simultaneous(tapGesture, panGesture);

    // [QA] Correct way to apply shared values to styles to avoid "Reading from value during render" warnings
    const rStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value }, 
            { translateY: translateY.value }
        ]
    }));

    const fontToUse = element.fontFamily || (element.isBold ? 'Poppins_700Bold' : 'Poppins_400Regular');

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={[
                rStyle, 
                { 
                    position: 'absolute', top: 0, left: 0,
                    width: element.width ? element.width * scale : undefined,
                    borderWidth: isSelected ? 2 : 0, 
                    borderColor: '#DC3C22', // Brand Cinnabar
                    borderStyle: 'dashed',
                    padding: 8,
                    zIndex: isSelected ? 100 : 1 
                }
            ]}>
                <Text style={{
                    fontSize: element.size * scale,
                    color: element.color,
                    fontFamily: fontToUse,
                    fontStyle: element.isItalic ? 'italic' : 'normal',
                    textDecorationLine: element.isUnderline ? 'underline' : 'none',
                    letterSpacing: element.tracking ? element.tracking * scale : 0,
                    textAlign: element.align || 'left',
                }}>
                    {element.text}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
});

export default DraggableText;