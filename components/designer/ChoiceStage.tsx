import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';

interface ChoiceStageProps {
  onSelectTemplate: () => void;
  onSelectUpload: () => void;
  onBack: () => void;
}

export default function ChoiceStage({ onSelectTemplate, onSelectUpload, onBack }: ChoiceStageProps) {
  return (
    <View className="flex-1 px-6 justify-center bg-canvas">
      {/* Navigation Header */}
      <View className="absolute top-4 left-6">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 bg-ink/5 rounded-full items-center justify-center">
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <Text className="text-3xl font-poppins-bold text-ink mb-2">How would you like to create?</Text>
      <Text className="text-sm text-ink/40 mb-8">Choose a pre-designed layout or start with a blank canvas.</Text>

      <View className="gap-y-4">
        <TouchableOpacity 
          onPress={onSelectTemplate} 
          className="bg-white p-6 rounded-[32px] border border-ink/5 shadow-sm flex-row items-center gap-x-4"
        >
          <View className="w-14 h-14 bg-primary/10 rounded-2xl items-center justify-center">
            <Ionicons name="library-outline" size={28} color={theme.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-poppins-bold text-ink">Template Library</Text>
            <Text className="text-xs text-ink/40">Browse professionally designed invites.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onSelectUpload} 
          className="bg-ink p-6 rounded-[32px] flex-row items-center gap-x-4"
        >
          <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center">
            <Ionicons name="create-outline" size={28} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-poppins-bold text-white">Build from Scratch</Text>
            <Text className="text-xs text-white/40">Start fresh and design it your way.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}