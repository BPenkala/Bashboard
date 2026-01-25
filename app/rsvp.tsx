import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useData } from '../context/DataContext';

export default function RSVPScreen() {
  const { guests, toggleGuestStatus } = useData();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Attending': return 'text-green-600 bg-green-100';
      case 'Not Attending': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-gray-500 mb-4">Tap a guest to cycle their status.</Text>
      
      {guests.map((guest) => (
        <TouchableOpacity 
          key={guest.id}
          onPress={() => toggleGuestStatus(guest.id)}
          className="bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm"
        >
          <View>
            <Text className="text-lg font-bold text-gray-800">{guest.name}</Text>
            <Text className="text-xs text-gray-400">Dietary: {guest.dietary}</Text>
          </View>
          
          <View className={`px-3 py-1 rounded-full ${getStatusColor(guest.status)}`}>
            <Text className={`text-xs font-bold ${getStatusColor(guest.status).split(' ')[0]}`}>
              {guest.status}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}