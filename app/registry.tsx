import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // FIXED: Restored hooks
import { Ionicons } from '@expo/vector-icons';
import { primitives, PALETTE } from '../constants/Colors';

export default function Registry() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  
  // Note: For a real app, you'd add Registry items to DataContext. 
  // For now, we'll keep the mock logic but ensure the layout is Heritage Tech.
  const [items, setItems] = useState([{ id: '1', name: 'Leica M11', store: 'Heritage Camera' }]);

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="p-6">
          
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-brand-cobalt rounded-full items-center justify-center shadow-sm">
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-brand-cobalt text-xl font-poppins-bold">Gift Registry</Text>
            <View className="w-10" />
          </View>

          {/* Add Item Banner */}
          <View className="bg-brand-sand/20 p-8 rounded-squircle mb-8 border border-brand-sand">
             <Text className="text-brand-midnight text-[10px] font-poppins-bold uppercase mb-4 tracking-widest">Contribute to Collection</Text>
             <View className="flex-row gap-2">
               <TextInput 
                  placeholder="Paste URL or Item name..." 
                  placeholderTextColor="#3D74B666"
                  className="flex-1 bg-white p-4 rounded-xl font-poppins-reg text-brand-cobalt" 
               />
               <TouchableOpacity className="w-14 bg-brand-cobalt rounded-xl items-center justify-center">
                  <Ionicons name="add" size={28} color="white" />
               </TouchableOpacity>
             </View>
          </View>

          <FlatList 
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="bg-white mb-4 p-6 rounded-squircle flex-row items-center justify-between border border-brand-sand/30 shadow-sm">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-brand-sand/20 rounded-full items-center justify-center">
                    <Ionicons name="camera" size={22} color={primitives.cobalt} />
                  </View>
                  <View>
                    <Text className="text-brand-midnight font-poppins-bold text-lg">{item.name}</Text>
                    <Text className="text-brand-cobalt text-[10px] font-poppins-black uppercase">{item.store}</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="open-outline" size={20} color={primitives.cinnabar} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}