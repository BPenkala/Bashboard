import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import BentoCard from '../components/BentoCard';
import Wordmark from '../components/Wordmark';
import { theme } from '../constants/Colors';

export default function Dashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" />
      <View className="px-6 py-4 flex-row justify-between items-center">
        <Wordmark size={24} color={theme.ink} />
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-ink/10 shadow-sm">
          <Ionicons name="person-outline" size={20} color={theme.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          onPress={() => router.push('/invite')}
          style={{ backgroundColor: theme.primary }}
          className="w-full aspect-[16/9] rounded-bento p-8 justify-between shadow-lg mb-8"
        >
          <View>
            <Text className="text-white font-poppins-bold text-3xl">Host an Event</Text>
            <Text className="text-white/80 font-poppins-reg text-sm mt-1">Design, Invite, Celebrate.</Text>
          </View>
          <Ionicons name="add-circle" size={48} color="white" />
        </TouchableOpacity>

        <View className="flex-row flex-wrap justify-between pb-20">
          <BentoCard title="Guests" color={theme.primary} onPress={() => router.push('/guests')} className="w-[48%]">
            <Ionicons name="people" size={24} color="white" />
          </BentoCard>
          <BentoCard title="Tasks" color={theme.secondary} onPress={() => router.push('/kanban')} className="w-[48%]">
            <Ionicons name="list" size={24} color={theme.ink} />
          </BentoCard>
          <BentoCard title="Registry" color={theme.accent} onPress={() => router.push('/registry')} className="w-full">
            <Ionicons name="gift" size={32} color="white" />
          </BentoCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}