import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/Colors';

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string; 
  onPress?: () => void;
  color?: string; 
  isStatic?: boolean;
}

export default function BentoCard({ 
  title, subtitle, children, className = "", onPress, color, isStatic = false 
}: BentoCardProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      activeOpacity={0.9}
      onPress={onPress} 
      style={[
        styles.cardBase, 
        { backgroundColor: color || theme.surface },
        !isStatic && styles.glassEdge
      ]}
      className={`p-5 mb-5 ${className}`}
    >
      {title && (
        <View className="mb-3">
          <Text className="text-xl font-poppins-bold text-ink leading-tight">{title}</Text>
          {subtitle && (
            <Text className="text-sm font-poppins-reg text-ink-muted mt-1">{subtitle}</Text>
          )}
        </View>
      )}
      <View className="flex-1">{children}</View>
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
  },
  glassEdge: {
    borderWidth: 1,
    borderColor: theme.border,
  }
});