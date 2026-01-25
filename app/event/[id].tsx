import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import { primitives, PALETTE } from '../../constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 24;
const GAP = 12;
const BENTO_WIDTH = SCREEN_WIDTH - (GRID_PADDING * 2);
const TILE_2x2 = (BENTO_WIDTH * 0.65);
const TILE_1x1 = (BENTO_WIDTH - TILE_2x2 - GAP);

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tasks, guests } = useData();

  // Filter data for this specific event
  const eventTasks = tasks.filter(t => t.eventId === id);
  const eventGuests = guests.filter(g => g.eventId === id);
  const pendingTasks = eventTasks.filter(t => t.status === 'Todo').length;

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* Navigation Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-brand-sand/30">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-white rounded-full items-center justify-center border border-brand-sand shadow-sm"
          >
            <Ionicons name="chevron-back" size={24} color={primitives.cobalt} />
          </TouchableOpacity>
          <Text className="text-xl font-poppins-bold text-brand-cobalt">Event Command</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mb-1">Active Record</Text>
          <Text className="text-brand-cobalt text-4xl font-poppins-black tracking-tight mb-8 pt-5 leading-tight">
            Management
          </Text>

          {/* EVENT-SPECIFIC BENTO GRID */}
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            
            {/* TO-DO LIST (REPLACED LEDGER - THE DISRUPTOR) */}
            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/kanban', params: { eventId: id } })} 
              activeOpacity={0.9} 
              style={[styles.cinnabarCard, { width: TILE_2x2, height: TILE_2x2 }]} 
              className="bg-brand-cinnabar rounded-squircle p-6 justify-between"
            >
              <View>
                <Text className="text-white text-3xl font-poppins-black tracking-tight leading-tight">To-Do List</Text>
                <Text className="text-white/60 text-[10px] font-poppins-bold uppercase tracking-widest mt-1">Checklist Records</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-4xl font-poppins-black">{pendingTasks}</Text>
                <Ionicons name="list" size={32} color="white" />
              </View>
            </TouchableOpacity>

            <View style={{ gap: GAP }}>
              {/* GUEST LIST (1x1 TILE) */}
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/guests', params: { eventId: id } })} 
                activeOpacity={0.8} 
                style={{ width: TILE_1x1, height: (TILE_2x2 - GAP) / 2 }} 
                className="bg-brand-cobalt rounded-squircle items-center justify-center shadow-lg shadow-brand-cobalt/20"
              >
                <Text className="text-white text-2xl font-poppins-black leading-none">{eventGuests.length}</Text>
                <Text className="text-white/60 text-[9px] font-poppins-bold uppercase mt-1">Guests</Text>
              </TouchableOpacity>

              {/* REGISTRY (1x1 TILE) */}
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/registry', params: { eventId: id } })} 
                activeOpacity={0.8} 
                style={{ width: TILE_1x1, height: (TILE_2x2 - GAP) / 2 }} 
                className="bg-brand-cream rounded-squircle items-center justify-center border-2 border-brand-sand"
              >
                <Ionicons name="gift" size={24} color={primitives.midnight} />
                <Text className="text-brand-midnight/60 text-[9px] font-poppins-bold uppercase mt-1">Registry</Text>
              </TouchableOpacity>
            </View>

            {/* DESIGN SETTINGS (3x1 TILE) */}
            <TouchableOpacity 
              onPress={() => router.push('/invite')} 
              activeOpacity={0.8} 
              style={[styles.sandCard, { width: BENTO_WIDTH }]} 
              className="h-24 bg-brand-sand rounded-squircle px-8 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="brush" size={20} color={primitives.midnight} />
                <Text className="text-brand-midnight text-lg font-poppins-black ml-4">Edit Invitation</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={primitives.midnight} />
            </TouchableOpacity>
          </View>
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cinnabarCard: {
    shadowColor: '#DC3C22',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  sandCard: {
    backgroundColor: 'rgba(234, 200, 166, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  }
});