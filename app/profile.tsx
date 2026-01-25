import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import { PALETTE } from '../constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateProfile } = useData();
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);

  const handleSave = () => {
    updateProfile({ name, bio });
    router.back();
  };

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center justify-between mb-10">
              <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-brand-sand shadow-sm">
                <Ionicons name="chevron-back" size={24} color={PALETTE.cobalt} />
              </TouchableOpacity>
              <Text className="text-xl font-poppins-bold text-brand-cobalt">Heritage Profile</Text>
              <View className="w-10" />
            </View>

            <View className="items-center mb-12">
              <View className="w-32 h-32 rounded-squircle overflow-hidden border-4 border-brand-sand bg-white shadow-xl">
                {userProfile.profileImage ? <Image source={{ uri: userProfile.profileImage }} className="w-full h-full" /> : <View className="flex-1 items-center justify-center"><Ionicons name="person" size={48} color={PALETTE.cobalt} /></View>}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-brand-cobalt/50 text-[10px] font-poppins-bold uppercase tracking-widest mb-2 ml-1">Member Identity</Text>
              <TextInput value={name} onChangeText={setName} className="bg-white text-brand-cobalt text-lg font-poppins-med p-6 rounded-2xl border border-brand-sand shadow-sm mb-6" />

              <Text className="text-brand-cobalt/50 text-[10px] font-poppins-bold uppercase tracking-widest mb-2 ml-1">Heritage Bio</Text>
              <TextInput value={bio} onChangeText={setBio} multiline className="bg-white text-brand-cobalt text-lg font-poppins-med p-6 rounded-2xl border border-brand-sand shadow-sm min-h-[120px]" />
            </View>

            <TouchableOpacity onPress={handleSave} className="w-full bg-brand-cobalt py-5 rounded-2xl items-center shadow-lg shadow-brand-cobalt/20 mb-10">
              <Text className="text-white font-poppins-black text-lg uppercase tracking-wider">Update Records</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}