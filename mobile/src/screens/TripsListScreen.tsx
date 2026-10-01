import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TripWithCapacityDto } from '../types';
import apiClient from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'TripsList'>;

export default function TripsListScreen({ navigation }: Props) {
  const [trips, setTrips] = useState<TripWithCapacityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const fetchTrips = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (source.trim()) params.source = source.trim();
      if (destination.trim()) params.destination = destination.trim();
      if (date.trim()) params.date = date.trim();

      const res = await apiClient.get<TripWithCapacityDto[]>('/trips', { params });
      setTrips(res.data);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message ?? 'Failed to load trips');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [source, destination, date]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const renderItem = ({ item }: { item: TripWithCapacityDto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TripDetail', { trip: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.route}>
          {item.source} → {item.destination}
        </Text>
        <View style={[styles.badge, item.remainingCapacity <= 0 && styles.badgeFull]}>
          <Text style={styles.badgeText}>
            {item.remainingCapacity > 0 ? `${item.remainingCapacity} kg left` : 'Full'}
          </Text>
        </View>
      </View>
      <Text style={styles.boatName}>🚢 {item.boatName}</Text>
      <Text style={styles.meta}>
        Departs: {new Date(item.departureTime).toLocaleString()}
      </Text>
      <Text style={styles.price}>৳ {item.pricePerKg} / kg</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="From"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="To"
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchTrips()}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a085" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => String(item.tripId)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchTrips(true)} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No trips found. Try different filters.</Text>
          }
          contentContainerStyle={trips.length === 0 ? styles.emptyContainer : styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  filterRow: {
    backgroundColor: '#fff',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 9,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  searchBtn: {
    backgroundColor: '#16a085',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  list: { padding: 12, gap: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#999', fontSize: 15, textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  route: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', flex: 1 },
  badge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeFull: { backgroundColor: '#fce4ec' },
  badgeText: { fontSize: 12, color: '#2e7d32', fontWeight: '600' },
  boatName: { fontSize: 13, color: '#555', marginBottom: 4 },
  meta: { fontSize: 13, color: '#777', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '700', color: '#16a085' },
});
