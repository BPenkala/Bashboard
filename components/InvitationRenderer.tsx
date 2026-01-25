import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const REFERENCE_WIDTH = 375;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface InvitationRendererProps {
  elements: any;
  backgroundUrl?: string;
  overlayOpacity?: number;
  containerWidth?: number;
  aspectRatio?: number;
}

export default function InvitationRenderer({
  elements,
  backgroundUrl,
  overlayOpacity = 0.1,
  containerWidth = SCREEN_WIDTH,
  aspectRatio = 1.5, 
}: InvitationRendererProps) {
  
  const scale = containerWidth / REFERENCE_WIDTH;

  if (!elements) return null;

  return (
    <View style={[styles.container, { width: containerWidth, height: containerWidth * aspectRatio }]}>
      <ImageBackground
        source={{ uri: backgroundUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }]} />
        
        <View className="flex-1">
          {Object.keys(elements).map((key) => {
            const el = elements[key];
            
            // VISIBILITY CHECK
            if (el.visible === false) return null;

            // PRIORITY: Specific Font Family > Bold/Black Logic > Default
            const fontToUse = el.fontFamily 
              ? el.fontFamily 
              : el.isBold 
                ? (key === 'main' ? 'Poppins_900Black' : 'Poppins_700Bold') 
                : 'Poppins_400Regular';

            const positionStyle: any = {
                position: 'absolute',
                top: el.y * scale,
            };

            if (el.x !== undefined) {
                positionStyle.left = el.x * scale;
            } else {
                positionStyle.left = 0;
                positionStyle.right = 0;
                positionStyle.alignItems = el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start';
                positionStyle.paddingHorizontal = 20 * scale;
            }

            if (el.width) {
                positionStyle.width = el.width * scale;
            }

            return (
              <View key={key} style={positionStyle}>
                <Text 
                  style={{ 
                    fontSize: el.size * scale, 
                    color: el.color,
                    textAlign: el.align || 'left',
                    fontFamily: fontToUse,
                    fontStyle: el.isItalic ? 'italic' : 'normal',
                    textDecorationLine: el.isUnderline ? 'underline' : 'none',
                    lineHeight: el.size * scale * (el.lineHeight || 1.2),
                    letterSpacing: el.tracking ? el.tracking * scale : 0
                  }}
                >
                  {el.text}
                </Text>
              </View>
            );
          })}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
});