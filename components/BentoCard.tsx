import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

// This allows us to pass custom classes to the View
const StyledView = styled(View);

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string; // For overriding sizes (e.g., w-full vs w-1/2)
  onPress?: () => void;
  color?: string; // Optional custom background color
}

export default function BentoCard({ title, subtitle, children, className, onPress, color }: BentoCardProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  // Default bg-white, but can be overridden
  const bgClass = color ? '' : 'bg-white';
  
  return (
    <Container 
      onPress={onPress} 
      className={`p-5 rounded-3xl shadow-sm mb-4 ${bgClass} ${className}`}
      style={color ? { backgroundColor: color } : {}}
    >
      {title && (
        <View className="mb-2">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
        </View>
      )}
      <View>
        {children}
      </View>
    </Container>
  );
}