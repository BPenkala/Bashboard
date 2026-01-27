import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Colors';

export default function BackgroundPicker({ onImageSelected }: { onImageSelected: (uri: string) => void }) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Required', 'We need access to your photos.'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [2, 3], quality: 0.8 });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  return (
    <View className="flex-1 px-6 justify-center bg-canvas">
      <Text className="text-3xl font-poppins-bold text-ink mb-2">Build from Scratch</Text>
      <Text className="text-sm text-ink/40 mb-8">Select a photo from your library to use as your canvas.</Text>

      <TouchableOpacity onPress={pickImage} className="w-full h-64 bg-white rounded-[40px] border-2 border-dashed border-ink/10 items-center justify-center">
        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
          <Ionicons name="cloud-upload-outline" size={32} color={theme.primary} />
        </View>
        <Text className="text-lg font-poppins-bold text-ink">Upload from Device</Text>
        <Text className="text-xs text-ink/40 mt-1">PNG, JPG up to 10MB</Text>
      </TouchableOpacity>
    </View>
  );
}