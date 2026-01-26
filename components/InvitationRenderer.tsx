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
  eventData?: any;
}

/**
 * [LDEV] Optimized Invitation Renderer
 * Resolves invisible text issues by providing hard fallbacks for color and content.
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
      {/* [QA] Improved ImageBackground handling for more robust CDN loads */}
      <ImageBackground
        source={{ uri: backgroundUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        fadeDuration={300}
      >
        {/* Background Overlay for Contrast */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: overlayOpacity }]} />
        
        <View style={{ flex: 1 }}>
          {Object.keys(elements).map((key) => {
            const el = elements[key];
            if (!el || el.visible === false) return null;

            // --- THE MAGIC: DYNAMIC CONTENT REPLACEMENT ---
            // [STRAT] Hobnob-style logic: Map form fields to template placeholders
            let displayText = el.text || "";
            if (eventData) {
                if (key === 'main') displayText = eventData.name || "Event Name";
                else if (key === 'header') displayText = eventData.type || "You are invited";
                else if (key.includes('date')) {
                    displayText = eventData.date ? eventData.date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "Date";
                }
                else if (key.includes('time')) {
                    displayText = eventData.isTimeTBD ? 'TBD' : (eventData.time ? eventData.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : "Time");
                }
                else if (key === 'location') displayText = eventData.location || "Location";
            }

            // [HCI] Font hierarchy fallback
            const fontToUse = el.fontFamily 
              ? el.fontFamily 
              : el.isBold 
                ? (key === 'main' ? 'Poppins_900Black' : 'Poppins_700Bold') 
                : 'Poppins_400Regular';

            const positionStyle: any = {
                position: 'absolute',
                top: el.y * scale,
                left: (el.x || 0) * scale,
                width: (el.width || REFERENCE_WIDTH) * scale,
                alignItems: el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start',
            };

            return (
              <View key={key} style={positionStyle}>
                <Text 
                  style={{ 
                    fontSize: (el.size || 16) * scale, 
                    color: el.color || '#FFFFFF', // [QA] CRITICAL: Hard fallback to white to ensure visibility
                    textAlign: el.align || 'left',
                    fontFamily: fontToUse,
                    fontStyle: el.isItalic ? 'italic' : 'normal',
                    textDecorationLine: el.isUnderline ? 'underline' : 'none',
                    lineHeight: (el.size || 16) * scale * (el.lineHeight || 1.2),
                    letterSpacing: el.tracking ? el.tracking * scale : 0
                  }}
                  numberOfLines={2}
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
    backgroundColor: '#333', // Darker fallback to help white text visibility while loading
    overflow: 'hidden',
  },
});

export default InvitationRenderer;