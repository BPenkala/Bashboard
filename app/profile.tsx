import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/Colors';
import { useData } from '../context/DataContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateProfile, settings, updateSettings } = useData();
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);

  const handleSave = () => {
    updateProfile({ name, bio });
    router.back();
  };

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center justify-between mb-10">
              <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-surface rounded-full items-center justify-center border border-ink/10 shadow-sm">
                <Ionicons name="chevron-back" size={24} color={theme.ink} />
              </TouchableOpacity>
              <Text className="text-xl font-poppins-bold text-ink">Profile Settings</Text>
              <View className="w-10" />
            </View>

            <View className="items-center mb-12">
              <View className="w-32 h-32 rounded-bento overflow-hidden border-4 border-surface bg-surface shadow-xl">
                {userProfile.profileImage ? (
                  <Image source={{ uri: userProfile.profileImage }} className="w-full h-full" />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="person" size={48} color={theme.ink} />
                  </View>
                )}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-ink/50 text-[10px] font-poppins-bold uppercase tracking-widest mb-2 ml-1">Member Name</Text>
              <TextInput value={name} onChangeText={setName} className="bg-surface text-ink text-lg font-poppins-med p-6 rounded-inner border border-ink/10 shadow-sm mb-6" />

              <Text className="text-ink/50 text-[10px] font-poppins-bold uppercase tracking-widest mb-2 ml-1">About You</Text>
              <TextInput value={bio} onChangeText={setBio} multiline className="bg-surface text-ink text-lg font-poppins-med p-6 rounded-inner border border-ink/10 shadow-sm min-h-[120px] mb-10" />

              <View className="bg-surface p-6 rounded-inner border border-ink/10 shadow-sm flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-ink font-poppins-bold text-lg">Haptic Feedback</Text>
                  <Text className="text-ink/40 text-xs leading-tight">Tactile response on interactions</Text>
                </View>
                <Switch 
                  value={settings.hapticsEnabled} 
                  onValueChange={(v) => updateSettings({ hapticsEnabled: v })}
                  trackColor={{ false: '#ACBEF2', true: '#88A2F2' }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSave} className="w-full bg-ink py-5 rounded-inner items-center shadow-lg mb-10">
              <Text className="text-white font-poppins-bold text-lg uppercase tracking-wider">Update Records</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}