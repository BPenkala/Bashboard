import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeOut, SlideInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/Colors';

export default function BashboardTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  // Filter routes to map to our 5 slots
  // Slot 1: Home (index)
  // Slot 2: Planner (kanban)
  // Slot 3: ACTION HUB (Virtual)
  // Slot 4: Studio (registry)
  // Slot 5: Guests (guests)
  const relevantRoutes = state.routes.filter(route => 
    ['index', 'kanban', 'registry', 'guests'].includes(route.name)
  );

  const handleCreatorPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setMenuVisible(true);
  };

  const handleAction = (action: string) => {
    setMenuVisible(false);
    if (action === 'design') {
      router.push('/invite');
    }
    // Add 'event' logic here in future
  };

  return (
    <>
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 10 }]}>
        {/* SLOT 1: HOME */}
        <TabIcon 
          route={relevantRoutes.find(r => r.name === 'index')} 
          isActive={state.index === state.routes.findIndex(r => r.name === 'index')}
          icon="home-outline" 
          activeIcon="home"
          navigation={navigation}
        />

        {/* SLOT 2: PLANNER */}
        <TabIcon 
          route={relevantRoutes.find(r => r.name === 'kanban')} 
          isActive={state.index === state.routes.findIndex(r => r.name === 'kanban')}
          icon="bar-chart-outline" 
          activeIcon="bar-chart"
          navigation={navigation}
        />

        {/* SLOT 3: THE CREATOR (Center Hub) */}
        <View style={styles.centerSlot}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleCreatorPress}
            style={styles.creatorButton}
          >
            <Ionicons name="add" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* SLOT 4: STUDIO */}
        <TabIcon 
          route={relevantRoutes.find(r => r.name === 'registry')} 
          isActive={state.index === state.routes.findIndex(r => r.name === 'registry')}
          icon="bookmark-outline" 
          activeIcon="bookmark"
          navigation={navigation}
        />

        {/* SLOT 5: GUESTS */}
        <TabIcon 
          route={relevantRoutes.find(r => r.name === 'guests')} 
          isActive={state.index === state.routes.findIndex(r => r.name === 'guests')}
          icon="people-outline" 
          activeIcon="people"
          navigation={navigation}
        />
      </View>

      {/* CREATOR MENU OVERLAY */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View 
            entering={SlideInDown.springify().damping(15)} 
            exiting={FadeOut}
            style={[styles.menuContainer, { paddingBottom: insets.bottom + 20 }]}
          >
            <Text style={styles.menuHeader}>Create New</Text>
            
            <TouchableOpacity onPress={() => handleAction('design')} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name="color-palette" size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.menuTitle}>Invitation Design</Text>
                <Text style={styles.menuSubtitle}>Start a new visual canvas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAction('event')} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: theme.ink }]}>
                <Ionicons name="calendar" size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.menuTitle}>New Event</Text>
                <Text style={styles.menuSubtitle}>Plan a gathering from scratch</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const TabIcon = ({ route, isActive, icon, activeIcon, navigation }: any) => {
  if (!route) return <View style={styles.tabSlot} />;

  const onPress = () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isActive && !event.defaultPrevented) {
      Haptics.selectionAsync();
      navigation.navigate(route.name);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(isActive ? -4 : 0, { stiffness: 200, damping: 15 }) }],
    opacity: withSpring(isActive ? 1 : 0.5),
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabSlot} hitSlop={{ top: 10, bottom: 10 }}>
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name={isActive ? activeIcon : icon} 
          size={26} 
          color={isActive ? theme.primary : theme.ink} 
        />
        {isActive && <View style={styles.activeDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(29, 31, 38, 0.05)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: Platform.OS === 'ios' ? 90 : 70,
    alignItems: 'center',
  },
  tabSlot: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  centerSlot: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -25 },
  creatorButton: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: theme.ink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.ink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
  },
  activeDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: theme.primary,
    position: 'absolute', bottom: -10, alignSelf: 'center',
  },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 },
  menuHeader: { fontFamily: 'Poppins_700Bold', fontSize: 12, color: theme.ink, opacity: 0.4, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 16 },
  menuIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.ink },
  menuSubtitle: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: theme.ink, opacity: 0.6 },
});