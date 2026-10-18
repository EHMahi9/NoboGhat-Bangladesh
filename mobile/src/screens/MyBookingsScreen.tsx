import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BookingSummary } from '../types';
import apiClient from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'MyBookings'>;

export default function MyBookingsScreen({ navigation }: Props) {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Always pull fresh from backend — NO local caching of confirmation state
  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiClient.get<BookingSummary[]>('/bookings');
      setBookings(res.data);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message ?? 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'PENDING':
        return { bg: '#fff8e1', text: '#f57f17' };
      case 'CANCELLED':
        return { bg: '#ffebee', text: '#c62828' };
      case 'COMPLETED':
        return { bg: '#e3f2fd', text: '#1565c0' };
      default:
        return { bg: '#f5f5f5', text: '#616161' };
    }
  };

  const renderItem = ({ item }: { item: BookingSummary }) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.bookingId}>Booking #{item.bookingId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.route}>
          {item.source} → {item.destination}
        </Text>

        <Text style={styles.detail}>🚢 Boat: {item.boatName}</Text>
        <Text style={styles.detail}>📦 Cargo: {item.cargoWeight} kg ({item.cargoType})</Text>
        <Text style={styles.detail}>
          🕒 Departure: {item.departureTime ? new Date(item.departureTime).toLocaleString() : 'N/A'}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.fareLabel}>Total Fare:</Text>
          <Text style={styles.fare}>৳ {item.totalFare?.toFixed(2) ?? '0.00'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('TripsList')}
        >
          <Text style={styles.browseBtnText}>+ Book Another Cargo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a085" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.bookingId)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchBookings(true)} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubtitle}>You haven't made any cargo bookings yet.</Text>
            </View>
          }
          contentContainerStyle={bookings.length === 0 ? styles.emptyList : styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  topActions: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  browseBtn: {
    backgroundColor: '#16a085',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  route: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  detail: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 10,
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  fare: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a085',
  },
});
