import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BentoCard from '../components/BentoCard';
import Wordmark from '../components/Wordmark';
import Colors from '../constants/Colors';
// Corrected path: index.tsx and utils/ are siblings inside the app/ folder
import { supabase } from './utils/supabase';

const { width } = Dimensions.get('window');

interface EventRecord {
  id: string;
  name: string;
  location: string;
  date: string;
  background_url: string | null;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, location, date, background_url')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Dashboard Fetch Warning:", error.message);
        return;
      }
      setEvents(data || []);
    } catch (error: any) {
      console.error("Dashboard Fetch Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderItem = ({ item, index }: { item: EventRecord; index: number }) => {
    const isFullWidth = index % 3 === 0;
    return (
      <View style={isFullWidth ? styles.fullWidthWrapper : styles.halfWidthWrapper}>
        <BentoCard
          title={item.name}
          subtitle={item.date ? new Date(item.date).toLocaleDateString() : 'Upcoming'}
          imageUri={item.background_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop'}
          onPress={() => router.push(`/event/${item.id}`)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wordmark color={Colors.light.primary} size={28} />
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={40} color={Colors.light.primary} />
              </View>
              <Text style={styles.emptyTitle}>No events found</Text>
              <TouchableOpacity 
                style={styles.createButton} 
                onPress={() => router.push('/invite')}
              >
                <Text style={styles.createButtonText}>Create Invitation</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/invite')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    zIndex: 10,
  },
  listContent: { padding: 12, paddingBottom: 120 },
  row: { justifyContent: 'flex-start' },
  fullWidthWrapper: { width: '100%', padding: 6 },
  halfWidthWrapper: { width: '50%', padding: 6 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { marginTop: 80, alignItems: 'center' },
  emptyIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFF', justifyContent: 'center',
    alignItems: 'center', marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1D1F26' },
  createButton: {
    backgroundColor: '#88A2F2', paddingHorizontal: 32,
    paddingVertical: 16, borderRadius: 20, marginTop: 24,
  },
  createButtonText: { color: '#FFF', fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#88A2F2', justifyContent: 'center',
    alignItems: 'center', elevation: 8,
  },
});