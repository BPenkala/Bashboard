import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { palette } from '../constants/Colors';

export default function Registry() {
  const router = useRouter();
  const [items] = useState([{ id: '1', name: 'Leica M11', store: 'Heritage Camera' }]);

  return (
    <View className="flex-1 bg-editorial-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
          
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-editorial-muted/10 shadow-sm">
              <Ionicons name="chevron-back" size={24} color={palette.ink} />
            </TouchableOpacity>
            <Text className="text-xl font-poppins-bold text-editorial-ink">Registry Collection</Text>
            <View className="w-10" />
          </View>

          <View className="bg-editorial-sage/10 p-8 rounded-bento mb-8 border border-editorial-sage/20 shadow-sm">
             <Text className="text-editorial-ink text-[10px] font-poppins-bold uppercase mb-4 tracking-widest text-center">Contribute to the Archive</Text>
             <View className="flex-row gap-2">
               <TextInput 
                  placeholder="Paste product URL..." 
                  placeholderTextColor={palette.muted}
                  className="flex-1 bg-white p-4 rounded-inner font-poppins-reg text-editorial-ink shadow-sm" 
               />
               <TouchableOpacity style={{ backgroundColor: palette.ink }} className="w-14 rounded-inner items-center justify-center shadow-sm">
                  <Ionicons name="add" size={28} color="white" />
               </TouchableOpacity>
             </View>
          </View>

          <FlatList 
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="bg-white mb-4 p-5 rounded-bento flex-row items-center justify-between border border-editorial-muted/5 shadow-sm">
                <View className="flex-row items-center gap-4">
                  <View className="w-14 h-14 bg-editorial-canvas rounded-inner items-center justify-center">
                    <Ionicons name="gift-outline" size={24} color={palette.ink} />
                  </View>
                  <View>
                    <Text className="text-editorial-ink font-poppins-bold text-lg leading-tight">{item.name}</Text>
                    <Text className="text-editorial-rose text-[10px] font-poppins-black uppercase tracking-widest">{item.store}</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Ionicons name="open-outline" size={20} color={palette.ink} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}