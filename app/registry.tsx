import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/Colors';

export default function Studio() {
  const router = useRouter();
  // Mock data for saved designs
  const [drafts] = useState([
    { id: '1', name: "Sarah's 30th", date: 'Edited 2h ago', status: 'Draft' },
    { id: '2', name: 'Summer BBQ', date: 'Sent', status: 'Live' }
  ]);

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="p-6 flex-1">
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-ink rounded-full items-center justify-center shadow-sm">
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-ink text-xl font-poppins-bold">The Studio</Text>
            <View className="w-10" />
          </View>

          <View className="bg-primary/10 p-8 rounded-bento mb-8 border border-primary/20 items-center">
             <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4">
                <Ionicons name="color-palette" size={32} color="white" />
             </View>
             <Text className="text-ink text-lg font-poppins-bold mb-1">Create New Design</Text>
             <Text className="text-ink/60 text-xs text-center mb-4">Start from a blank canvas or choose a template.</Text>
             <TouchableOpacity 
                onPress={() => router.push('/invite')}
                className="bg-ink px-6 py-3 rounded-xl"
             >
                <Text className="text-white font-poppins-bold text-xs uppercase tracking-widest">Open Designer</Text>
             </TouchableOpacity>
          </View>

          <Text className="text-ink text-[10px] font-poppins-bold uppercase mb-4 tracking-widest">Your Drafts</Text>

          <FlatList 
            data={drafts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="bg-surface mb-4 p-6 rounded-bento flex-row items-center justify-between border border-ink/5 shadow-sm">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-ink/5 rounded-full items-center justify-center">
                    <Ionicons name="document-text-outline" size={22} color={theme.ink} />
                  </View>
                  <View>
                    <Text className="text-ink font-poppins-bold text-lg">{item.name}</Text>
                    <Text className="text-ink/40 text-[10px] font-poppins-bold uppercase">{item.date}</Text>
                  </View>
                </View>
                <View className="bg-secondary/30 px-3 py-1 rounded-lg">
                    <Text className="text-ink text-[10px] font-poppins-bold uppercase">{item.status}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}