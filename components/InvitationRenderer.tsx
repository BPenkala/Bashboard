import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const REFERENCE_WIDTH = 375; // The width at which the manifest was designed

export default function InvitationRenderer({ elements, backgroundUrl, containerWidth, eventData }: any) {
  // Scale factor to ensure the design looks good on thumbnails AND full screen
  const scale = containerWidth / REFERENCE_WIDTH;

  // [LDEV] DATA INJECTION PIPELINE
  // This memoizes the "Hydrated" elements (User Data + Manifest Style)
  const renderableElements = useMemo(() => {
    if (!elements) return [];
    
    // Map standard manifest keys to user input
    return Object.keys(elements).map((key) => {
        const el = elements[key];
        let content = el.text;

        // INJECTION LOGIC:
        if (eventData) {
            if (key === 'main' && eventData.name) content = eventData.name;
            if (key === 'dateLabel') {
                const dateStr = new Date(eventData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const timeStr = new Date(eventData.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                content = `${dateStr} • ${timeStr}`;
            }
            if (key === 'location' && eventData.location) content = eventData.location;
        }

        return { ...el, content, key };
    });
  }, [elements, eventData]);

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <Image source={{ uri: backgroundUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: 0.25 }]} />
      
      {renderableElements.map((el: any) => {
         if (el.visible === false) return null;
         
         return (
            <Text
                key={el.key}
                style={{
                    position: 'absolute',
                    top: el.y * scale,
                    left: el.x * scale,
                    width: el.width * scale,
                    textAlign: el.align,
                    fontSize: el.size * scale,
                    fontFamily: el.fontFamily, // Uses the loaded Expo Google Font
                    color: el.color,
                    lineHeight: (el.lineHeight || 1.2) * (el.size * scale),
                    letterSpacing: (el.tracking || 0) * scale,
                    textTransform: el.uppercase ? 'uppercase' : 'none',
                    // Text Shadow for readability against photos
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4
                }}
            >
                {el.content}
            </Text>
         );
      })}
    </View>
  );
}