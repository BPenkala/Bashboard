import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // FIXED: Restored hooks
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { primitives } from '../constants/Colors';

export default function GuestList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams(); // Identify the event context
  const { guests, toggleGuestStatus, addGuest } = useData();
  const [newName, setNewName] = useState('');

  // Filter guests to only show those for this specific event
  const currentGuests = guests.filter(g => g.eventId === eventId);
  const confirmedCount = currentGuests.filter(g => g.status === 'Attending').length;

  const handleAddGuest = () => {
    if (newName.trim() && eventId) {
      addGuest(eventId as string, newName);
      setNewName('');
    }
  };

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
          
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
             <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-brand-cobalt rounded-full items-center justify-center shadow-sm">
               <Ionicons name="chevron-back" size={24} color="white" />
             </TouchableOpacity>
             <Text className="text-brand-cobalt text-xl font-poppins-bold">Guest Archives</Text>
             <View className="w-10" />
          </View>

          {/* Stats Bento */}
          <View className="flex-row gap-3 mb-8">
             <View className="flex-1 bg-brand-cinnabar/10 p-4 rounded-squircle items-center border border-brand-cinnabar/20">
                <Text className="text-brand-cinnabar text-3xl font-poppins-black">{confirmedCount}</Text>
                <Text className="text-brand-cinnabar/60 text-[10px] uppercase font-poppins-bold tracking-wider">Confirmed</Text>
             </View>
             <View className="flex-1 bg-brand-sand/30 p-4 rounded-squircle items-center border border-brand-sand">
                <Text className="text-brand-cobalt text-3xl font-poppins-black">{currentGuests.length}</Text>
                <Text className="text-brand-cobalt/60 text-[10px] uppercase font-poppins-bold tracking-wider">On List</Text>
             </View>
          </View>

          {/* Add Guest Input */}
          <View className="flex-row items-center bg-white rounded-2xl p-1 pl-5 mb-6 border border-brand-sand shadow-sm">
             <TextInput 
               value={newName}
               onChangeText={setNewName}
               placeholder="Add new guest..."
               placeholderTextColor="#3D74B666"
               className="flex-1 text-brand-cobalt h-12 font-poppins-reg"
             />
             <TouchableOpacity onPress={handleAddGuest} className="w-12 h-12 bg-brand-cinnabar rounded-xl items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
             </TouchableOpacity>
          </View>

          <FlatList
             data={currentGuests}
             keyExtractor={item => item.id}
             renderItem={({ item }) => (
               <TouchableOpacity 
                 onPress={() => toggleGuestStatus(item.id)}
                 className="flex-row items-center justify-between py-5 border-b border-brand-sand/50"
               >
                 <View className="flex-row items-center gap-4">
                    <View className={`w-3 h-3 rounded-full ${item.status === 'Attending' ? 'bg-brand-cinnabar shadow-lg shadow-brand-cinnabar/50' : 'bg-brand-cobalt/20'}`} />
                    <Text className={`text-lg font-poppins-med ${item.status === 'Attending' ? 'text-brand-cobalt' : 'text-brand-cobalt/40'}`}>
                      {item.name}
                    </Text>
                 </View>
                 {item.status === 'Attending' && <Ionicons name="checkmark-circle" size={22} color="#DC3C22" />}
               </TouchableOpacity>
             )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}