import React, { memo } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/Colors';

const REFERENCE_WIDTH = 375;

const InvitationRenderer = memo(({ elements, backgroundUrl, overlayOpacity = 0.2, containerWidth = Dimensions.get('window').width, eventData }: any) => {
  const scale = containerWidth / REFERENCE_WIDTH;
  if (!elements) return null;

  return (
    <View style={{ width: containerWidth, height: containerWidth * 1.5, backgroundColor: theme.ink, overflow: 'hidden' }}>
      <ImageBackground source={{ uri: backgroundUrl }} style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: overlayOpacity }]} />
        <View style={{ flex: 1 }}>
          {Object.keys(elements).map((key) => {
            const el = elements[key];
            if (!el || el.visible === false) return null;

            let displayText = el.text || "";
            if (eventData) {
              if (key === 'main') displayText = eventData.name || "Event Name";
              else if (key === 'header') displayText = eventData.type || "You are invited";
            }

            return (
              <View key={key} style={{ position: 'absolute', top: el.y * scale, left: (el.x || 0) * scale, width: (el.width || REFERENCE_WIDTH) * scale }}>
                <Text style={{ 
                  fontSize: (el.size || 16) * scale, 
                  color: el.color || theme.surface, 
                  textAlign: el.align || 'center',
                  fontFamily: el.fontFamily || 'Poppins_700Bold'
                }}>
                  {displayText}
                </Text>
              </View>
            );
          })}
        </View>
      </ImageBackground>
    </View>
  );
});

export default InvitationRenderer;