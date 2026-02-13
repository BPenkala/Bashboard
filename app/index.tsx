import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BentoCard from '../components/BentoCard';
import Wordmark from '../components/Wordmark';
import { theme } from '../constants/Colors';
import { supabase } from '../utils/supabase';

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

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const renderItem = ({ item, index }: { item: EventRecord; index: number }) => {
    const isFullWidth = index % 3 === 0;
    return (
      <View style={isFullWidth ? styles.fullWidthWrapper : styles.halfWidthWrapper}>
        <BentoCard
          title={item.name}
          subtitle={item.date ? new Date(item.date).toLocaleDateString() : 'Upcoming'}
          imageUri={item.background_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop'}
          onPress={() => router.push(`/event/${item.id}`)}
          style={{ height: 192 }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wordmark color={theme.primary} size={28} />
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color={theme.ink} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEvents} tintColor={theme.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={40} color={theme.primary} />
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
  container: {
    flex: 1,
    backgroundColor: theme.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthWrapper: {
    width: '100%',
    padding: 6,
  },
  halfWidthWrapper: {
    width: '50%',
    padding: 6,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: theme.ink,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
