import React, { memo } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';

const REFERENCE_WIDTH = 375;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface InvitationRendererProps {
  elements: any;
  backgroundUrl?: string;
  overlayOpacity?: number;
  containerWidth?: number;
  aspectRatio?: number;
  eventData?: any; // <--- The "Magic" Data Injection
}

/**
 * [LDEV] Optimized Invitation Renderer
 * Uses React.memo to prevent expensive re-renders during list scrolling.
 */
const InvitationRenderer = memo(({
  elements,
  backgroundUrl,
  overlayOpacity = 0.1,
  containerWidth = SCREEN_WIDTH,
  aspectRatio = 1.5,
  eventData
}: InvitationRendererProps) => {
  
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
        
        <View style={{ flex: 1 }}>
          {Object.keys(elements).map((key) => {
            const el = elements[key];
            
            if (el.visible === false) return null;

            // --- THE MAGIC: DYNAMIC CONTENT REPLACEMENT ---
            // [STRAT] This maps your input form fields to the template slots
            let displayText = el.text;
            if (eventData) {
                if (key === 'main') displayText = eventData.name || "Event Name";
                else if (key === 'header') displayText = eventData.type || "You are invited";
                else if (key.includes('date')) {
                    displayText = eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                }
                else if (key.includes('time')) {
                    displayText = eventData.isTimeTBD ? 'TBD' : eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                }
                else if (key === 'location') displayText = eventData.location || "Location";
            }

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
});

export default InvitationRenderer;