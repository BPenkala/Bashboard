import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/Colors';

export default function Registry() {
  const router = useRouter();
  const [items] = useState([{ id: '1', name: 'Leica M11', store: 'Heritage Camera' }]);

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="p-6 flex-1">
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-ink rounded-full items-center justify-center shadow-sm">
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-ink text-xl font-poppins-bold">Gift Registry</Text>
            <View className="w-10" />
          </View>

          <View className="bg-secondary p-8 rounded-bento mb-8 border border-secondary/20">
             <Text className="text-ink text-[10px] font-poppins-bold uppercase mb-4 tracking-widest">Contribute to Collection</Text>
             <View className="flex-row gap-2">
               <TextInput 
                  placeholder="Paste URL or Item name..." 
                  placeholderTextColor="#1D1F2666"
                  className="flex-1 bg-surface p-4 rounded-inner font-poppins-reg text-ink" 
               />
               <TouchableOpacity className="w-14 bg-ink rounded-inner items-center justify-center">
                  <Ionicons name="add" size={28} color="white" />
               </TouchableOpacity>
             </View>
          </View>

          <FlatList 
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="bg-surface mb-4 p-6 rounded-bento flex-row items-center justify-between border border-ink/5 shadow-sm">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-accent/20 rounded-full items-center justify-center">
                    <Ionicons name="camera" size={22} color={theme.ink} />
                  </View>
                  <View>
                    <Text className="text-ink font-poppins-bold text-lg">{item.name}</Text>
                    <Text className="text-primary text-[10px] font-poppins-black uppercase">{item.store}</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="open-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}