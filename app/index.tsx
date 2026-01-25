import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvitationRenderer from '../components/InvitationRenderer';
import Wordmark from '../components/Wordmark'; // <--- Branding integrated
import { useData } from '../context/DataContext';

// IMPORT THEME CONSTANTS
import { PALETTE } from '../constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

// --- MOCK DATA ---
const MOCK_ELEMENTS_WEDDING = {
    header: { text: "The Wedding of", font: "System", size: 14, color: '#3D74B6', align: "center", isBold: true },
    main: { text: "Sarah & James", font: "Poppins_900Black", size: 48, color: '#3D74B6', align: "center" },
    details: { text: "Jun 15 • 4:00 PM", font: "System", size: 16, color: '#3D74B6', align: "center" },
    location: { text: "The Grand Estate, Napa", font: "System", size: 14, color: '#3D74B6', align: "center", isBold: true }
};

const MY_INVITES = [
  {
    id: '1',
    event: "Sarah's Wedding",
    host: 'Sarah & James',
    status: 'going', 
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=800&auto=format&fit=crop',
    requiresEntryPass: false,
    design: { elements: MOCK_ELEMENTS_WEDDING, overlayOpacity: 0.1 } 
  }
];

const PLANNER_EVENTS = [
  { id: '1', title: 'Summer Gala', date: 'Aug 12', daysLeft: 12, role: 'Host' },
  { id: '2', title: "Harrison's 5th B-Day", date: 'Oct 05', daysLeft: 65, role: 'Parent' },
];

export default function Dashboard() {
  const router = useRouter();
  const { userProfile } = useData();
  const [persona, setPersona] = useState<'planner' | 'attendee'>('planner');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const togglePersona = (mode: 'planner' | 'attendee') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPersona(mode);
  };

  const PlannerView = () => (
    <View>
      <View className="flex-row justify-between items-end mb-4 px-1 mt-6">
          <Text className="text-brand-cobalt/60 text-[10px] font-poppins-bold uppercase tracking-widest">Upcoming Command</Text>
          <TouchableOpacity onPress={() => router.push('/invite')}>
            <Text className="text-xs font-poppins-bold text-brand-cobalt border-b border-brand-cobalt/30">NEW EVENT +</Text>
          </TouchableOpacity>
      </View>
      
      <FlatList 
        data={PLANNER_EVENTS} 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        keyExtractor={item => item.id} 
        snapToInterval={CARD_WIDTH + 16} 
        decelerationRate="fast" 
        contentContainerStyle={{ paddingRight: 24 }} 
        renderItem={({ item }) => (
           <TouchableOpacity 
             activeOpacity={0.9} 
             style={[styles.cobaltCard, { width: CARD_WIDTH }]} 
             className="h-72 bg-brand-cobalt rounded-squircle p-8 justify-between mr-4 relative overflow-hidden"
             onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
           >
              <View className="z-10">
                <View className="bg-brand-cream/20 px-3 py-1 rounded-full self-start mb-4">
                  <Text className="text-brand-cream text-[9px] font-poppins-bold uppercase tracking-widest">{item.role}</Text>
                </View>
                <Text className="text-6xl font-poppins-black text-brand-cream mb-0 -ml-1 tracking-tighter px-1 pt-5 leading-tight">
                  {item.daysLeft}
                </Text>
                <Text className="text-brand-cream/60 text-[10px] font-poppins-bold uppercase tracking-widest">Days until {item.date}</Text>
              </View>

              <View className="z-10">
                <Text className="text-brand-cream text-2xl font-poppins-bold mb-4" numberOfLines={1}>{item.title}</Text>
                
                {/* Visual Affordance: View Event Details */}
                <View className="bg-brand-cinnabar py-3 rounded-full items-center">
                    <Text className="text-white text-[10px] font-poppins-black uppercase tracking-widest">Manage Event Details</Text>
                </View>
              </View>
           </TouchableOpacity>
      )} />
      
      {/* Design Studio remains a global tool */}
      <TouchableOpacity 
          onPress={() => router.push('/invite')} 
          activeOpacity={0.9} 
          style={styles.cobaltCard} 
          className="w-full h-32 bg-brand-cobalt rounded-squircle p-8 mt-10 flex-row items-center justify-between"
      >
          <View>
            <Text className="text-white text-2xl font-poppins-black tracking-tight leading-tight">Design Studio</Text>
            <Text className="text-brand-cream/50 text-[10px] font-poppins-bold uppercase tracking-widest">Create Invitation</Text>
          </View>
          <Ionicons name="color-palette" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );

  const AttendeeView = () => (
    <View>
      <Text className="text-brand-cinnabar text-[10px] font-poppins-bold uppercase tracking-widest mt-6 mb-6 px-1">Active Invitations</Text>
      {MY_INVITES.map((invite) => (
        <TouchableOpacity key={invite.id} activeOpacity={0.9} onPress={() => setSelectedTicket(invite)} className="w-full mb-6 bg-white rounded-squircle border border-brand-sand shadow-sm overflow-hidden">
            <InvitationRenderer elements={invite.design.elements} backgroundUrl={invite.image} overlayOpacity={invite.design.overlayOpacity} mode="view" containerWidth={SCREEN_WIDTH - 48} />
            <View className="p-8 flex-row justify-between items-center">
                <View>
                    <Text className="text-brand-cinnabar font-poppins-bold text-[10px] uppercase tracking-widest mb-1">June 15 • 4:00 PM</Text>
                    <Text className="text-brand-cobalt text-2xl font-poppins-black leading-none">{invite.event}</Text>
                </View>
                <TouchableOpacity className="w-12 h-12 bg-brand-cinnabar rounded-full items-center justify-center">
                    <Ionicons name="ticket" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-brand-cream">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <View className="flex-row justify-between items-start">
              <View>
                {/* Wordmark replaces "Heritage Member" label for brand authority */}
                <Wordmark size={18} />
                <Text className="text-brand-cobalt text-5xl font-poppins-black tracking-tight mb-8 px-1 mt-6 leading-tight">
                  {userProfile.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/profile')} className="w-14 h-14 rounded-2xl overflow-hidden border border-brand-cobalt/10 bg-white">
                {userProfile.profileImage ? <Image source={{ uri: userProfile.profileImage }} className="w-full h-full" /> : <View className="flex-1 items-center justify-center"><Ionicons name="person" size={24} color={PALETTE.cobalt} /></View>}
              </TouchableOpacity>
            </View>
            
            <View className="flex-row bg-brand-sand/30 p-1.5 rounded-full h-16 border border-brand-sand">
                <TouchableOpacity onPress={() => togglePersona('planner')} className={`flex-1 flex-row items-center justify-center rounded-full ${persona === 'planner' ? 'bg-brand-cobalt' : ''}`}>
                    <Text className={`text-xs font-poppins-bold uppercase tracking-widest ${persona === 'planner' ? 'text-white' : 'text-brand-cobalt'}`}>Planner</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => togglePersona('attendee')} className={`flex-1 flex-row items-center justify-center rounded-full ${persona === 'attendee' ? 'bg-brand-cinnabar' : ''}`}>
                    <Text className={`text-xs font-poppins-bold uppercase tracking-widest ${persona === 'attendee' ? 'text-white' : 'text-brand-cobalt'}`}>Attendee</Text>
                </TouchableOpacity>
            </View>
          </View>
          {persona === 'planner' ? <PlannerView /> : <AttendeeView />}
          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cobaltCard: {
    shadowColor: '#3D74B6',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }
});