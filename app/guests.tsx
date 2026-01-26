import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { palette } from '../constants/Colors';
import { useData } from '../context/DataContext';

export default function GuestList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams(); 
  const { guests, toggleGuestStatus, addGuest } = useData();
  const [newName, setNewName] = useState('');

  const currentGuests = guests.filter(g => g.eventId === eventId);
  const confirmedCount = currentGuests.filter(g => g.status === 'Attending').length;

  const handleAddGuest = () => {
    if (newName.trim() && eventId) {
      addGuest(eventId as string, newName);
      setNewName('');
    }
  };

  return (
    <View className="flex-1 bg-editorial-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-5">
          
          {/* Header: Editorial Porcelain Style */}
          <View className="flex-row items-center justify-between mb-8">
             <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-editorial-muted/10">
               <Ionicons name="chevron-back" size={24} color={palette.ink} />
             </TouchableOpacity>
             <Text className="text-editorial-ink text-xl font-poppins-bold">Guest Archive</Text>
             <View className="w-10" />
          </View>

          {/* Stats Bento: Rose & Champagne Pivot */}
          <View className="flex-row gap-4 mb-8">
             <View className="flex-1 bg-editorial-rose p-5 rounded-bento items-center shadow-sm">
                <Text className="text-white text-3xl font-poppins-black">{confirmedCount}</Text>
                <Text className="text-white/80 text-[10px] uppercase font-poppins-bold tracking-widest mt-1">Confirmed</Text>
             </View>
             <View className="flex-1 bg-editorial-champagne/40 p-5 rounded-bento items-center border border-editorial-champagne shadow-sm">
                <Text className="text-editorial-ink text-3xl font-poppins-black">{currentGuests.length}</Text>
                <Text className="text-editorial-ink/40 text-[10px] uppercase font-poppins-bold tracking-widest mt-1">Invited</Text>
             </View>
          </View>

          {/* Add Guest: 12px interactive radius */}
          <View className="flex-row items-center bg-white rounded-inner p-1 pl-5 mb-8 border border-editorial-muted/10 shadow-sm">
             <TextInput 
               value={newName}
               onChangeText={setNewName}
               placeholder="Full name..."
               placeholderTextColor={palette.muted}
               className="flex-1 text-editorial-ink h-12 font-poppins-reg"
             />
             <TouchableOpacity onPress={handleAddGuest} style={{ backgroundColor: palette.ink }} className="w-12 h-12 rounded-inner items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
             </TouchableOpacity>
          </View>

          <FlatList
             data={currentGuests}
             keyExtractor={item => item.id}
             showsVerticalScrollIndicator={false}
             renderItem={({ item }) => (
               <TouchableOpacity 
                 onPress={() => toggleGuestStatus(item.id)}
                 className="flex-row items-center justify-between py-5 border-b border-editorial-muted/5"
               >
                 <View className="flex-row items-center gap-4">
                    <View className={`w-3 h-3 rounded-full ${item.status === 'Attending' ? 'bg-editorial-rose shadow-sm' : 'bg-editorial-muted/20'}`} />
                    <Text className={`text-lg font-poppins-med ${item.status === 'Attending' ? 'text-editorial-ink' : 'text-editorial-muted'}`}>
                      {item.name}
                    </Text>
                 </View>
                 {item.status === 'Attending' && <Ionicons name="checkmark-circle" size={22} color={palette.rose} />}
               </TouchableOpacity>
             )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}