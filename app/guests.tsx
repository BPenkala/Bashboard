import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
          <View className="flex-row items-center justify-between mb-8">
             <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-ink rounded-full items-center justify-center shadow-sm">
               <Ionicons name="chevron-back" size={24} color="white" />
             </TouchableOpacity>
             <Text className="text-ink text-xl font-poppins-bold">Guest Archives</Text>
             <View className="w-10" />
          </View>

          <View className="flex-row gap-3 mb-8">
             <View className="flex-1 bg-primary/10 p-4 rounded-bento items-center border border-primary/20">
                <Text className="text-primary text-3xl font-poppins-black">{confirmedCount}</Text>
                <Text className="text-primary/60 text-[10px] uppercase font-poppins-bold tracking-wider">Confirmed</Text>
             </View>
             <View className="flex-1 bg-accent/20 p-4 rounded-bento items-center border border-accent/40">
                <Text className="text-ink text-3xl font-poppins-black">{currentGuests.length}</Text>
                <Text className="text-ink/60 text-[10px] uppercase font-poppins-bold tracking-wider">On List</Text>
             </View>
          </View>

          <View className="flex-row items-center bg-white rounded-inner p-1 pl-5 mb-6 border border-ink/10 shadow-sm">
             <TextInput 
               value={newName}
               onChangeText={setNewName}
               placeholder="Add new guest..."
               placeholderTextColor="#1D1F2666"
               className="flex-1 text-ink h-12 font-poppins-reg"
             />
             <TouchableOpacity onPress={handleAddGuest} className="w-12 h-12 bg-primary rounded-inner items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
             </TouchableOpacity>
          </View>

          <FlatList
             data={currentGuests}
             keyExtractor={item => item.id}
             renderItem={({ item }) => (
               <TouchableOpacity 
                 onPress={() => toggleGuestStatus(item.id)}
                 className="flex-row items-center justify-between py-5 border-b border-ink/5"
               >
                 <View className="flex-row items-center gap-4">
                    <View className={`w-3 h-3 rounded-full ${item.status === 'Attending' ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-ink/10'}`} />
                    <Text className={`text-lg font-poppins-med ${item.status === 'Attending' ? 'text-ink' : 'text-ink/40'}`}>
                      {item.name}
                    </Text>
                 </View>
                 {item.status === 'Attending' && <Ionicons name="checkmark-circle" size={22} color="#88A2F2" />}
               </TouchableOpacity>
             )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}