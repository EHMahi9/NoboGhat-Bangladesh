import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TripDetail'>;

export default function TripDetailScreen({ route, navigation }: Props) {
  const { trip } = route.params;

  const rows: [string, string][] = [
    ['From', trip.source],
    ['To', trip.destination],
    ['Boat', trip.boatName],
    ['Boat Capacity', `${trip.boatCapacity} kg`],
    ['Remaining Capacity', `${trip.remainingCapacity} kg`],
    ['Price', `৳ ${trip.pricePerKg} per kg`],
    ['Departure', new Date(trip.departureTime).toLocaleString()],
  ];

  const isFull = trip.remainingCapacity <= 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.route}>
          {trip.source} → {trip.destination}
        </Text>
        <Text style={styles.price}>৳ {trip.pricePerKg} / kg</Text>
      </View>

      <View style={styles.detailCard}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isFull && styles.buttonDisabled]}
        disabled={isFull}
        onPress={() => navigation.navigate('CreateBooking', { trip })}
      >
        <Text style={styles.buttonText}>{isFull ? 'Trip Full' : 'Book Cargo'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  content: { padding: 16 },
  heroCard: {
    backgroundColor: '#16a085',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  route: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 },
  price: { fontSize: 16, color: '#d4efdf', fontWeight: '600' },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowLabel: { fontSize: 14, color: '#777', fontWeight: '500' },
  rowValue: { fontSize: 14, color: '#222', fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 12 },
  button: {
    backgroundColor: '#16a085',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#bbb' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
