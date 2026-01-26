import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const REFERENCE_WIDTH = 375; 

export default function InvitationRenderer({ elements, backgroundUrl, containerWidth, eventData }: any) {
  const scale = containerWidth / REFERENCE_WIDTH;

  const renderableElements = useMemo(() => {
    if (!elements) return [];
    
    return Object.keys(elements).map((key) => {
        const el = elements[key];
        let content = el.text;

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
         
         const fontSize = el.size * scale;
         // [LDEV] SAFE ZONE CALCULATION
         // We add padding to allow ascenders/descenders to render fully, 
         // then use negative margins to pull the element back to its exact coordinate.
         const safePadding = fontSize * 0.5; 

         return (
            <Text
                key={el.key}
                style={{
                    position: 'absolute',
                    top: (el.y * scale) - safePadding, // Offset up by padding amount
                    left: (el.x * scale) - safePadding, // Offset left by padding amount
                    width: (el.width * scale) + (safePadding * 2), // Expand width to compensate
                    textAlign: el.align,
                    fontSize: fontSize,
                    fontFamily: el.fontFamily,
                    color: el.color,
                    lineHeight: (el.lineHeight || 1.2) * fontSize,
                    letterSpacing: (el.tracking || 0) * scale,
                    textTransform: el.uppercase ? 'uppercase' : 'none',
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                    // The Magic Fix:
                    padding: safePadding, 
                }}
            >
                {el.content}
            </Text>
         );
      })}
    </View>
  );
}