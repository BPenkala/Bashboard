import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../constants/Colors';

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  imageUri?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  color?: string; 
  isStatic?: boolean;
}

export default function BentoCard({ 
  title, subtitle, children, imageUri, style, onPress, color, isStatic = false
}: BentoCardProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      activeOpacity={0.9}
      onPress={onPress} 
      style={[
        styles.cardBase, 
        { backgroundColor: color || theme.surface },
        !isStatic && styles.glassEdge,
        style
      ]}
    >
      {imageUri && (
        <View style={StyleSheet.absoluteFill}>
             <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={500} />
             <View style={styles.overlay} />
        </View>
      )}

      <View style={styles.content}>
          {title && (
            <View style={styles.header}>
              <Text style={[styles.title, { color: imageUri ? 'white' : theme.ink }]}>{title}</Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: imageUri ? 'rgba(255,255,255,0.8)' : theme.inkMuted }]}>{subtitle}</Text>
              )}
            </View>
          )}
          {children && <View style={styles.children}>{children}</View>}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 160,
    marginBottom: 20,
    overflow: 'hidden',
  },
  glassEdge: {
    borderWidth: 1,
    borderColor: theme.border,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 25,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  children: {
    flex: 1,
  }
});
