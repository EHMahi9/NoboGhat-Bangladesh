import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import apiClient from '../api/client';
import { BookingSummaryDto, PaymentInitiateResponseDto } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateBooking'>;

export default function CreateBookingScreen({ route, navigation }: Props) {
  const { trip } = route.params;
  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [loading, setLoading] = useState(false);

  const estimatedFare =
    cargoWeight && !isNaN(parseFloat(cargoWeight))
      ? (parseFloat(cargoWeight) * trip.pricePerKg).toFixed(2)
      : null;

  const handleBook = async () => {
    const weight = parseFloat(cargoWeight);
    if (!cargoWeight || isNaN(weight) || weight <= 0) {
      Alert.alert('Validation', 'Please enter a valid cargo weight.');
      return;
    }
    if (weight > trip.remainingCapacity) {
      Alert.alert('Capacity Exceeded', `Only ${trip.remainingCapacity} kg remaining on this trip.`);
      return;
    }
    if (!cargoType.trim()) {
      Alert.alert('Validation', 'Please enter a cargo type.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create booking
      const bookingRes = await apiClient.post<BookingSummaryDto>('/bookings', {
        tripId: trip.tripId,
        cargoWeight: weight,
        cargoType: cargoType.trim(),
      });
      const booking = bookingRes.data;

      // Step 2: Initiate payment immediately
      const paymentRes = await apiClient.post<PaymentInitiateResponseDto>('/payments/initiate', {
        bookingId: booking.bookingId,
      });

      navigation.replace('Payment', {
        bookingId: booking.bookingId,
        transactionRef: paymentRes.data.transactionRef,
        amount: paymentRes.data.amount,
        gateway: paymentRes.data.gateway || 'SSLCommerz',
      });
    } catch (err: any) {
      Alert.alert('Booking Failed', err?.response?.data?.message ?? err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.tripSummary}>
        <Text style={styles.tripRoute}>
          {trip.source} → {trip.destination}
        </Text>
        <Text style={styles.tripMeta}>🚢 {trip.boatName} · ৳ {trip.pricePerKg}/kg</Text>
      </View>

      <Text style={styles.label}>Cargo Weight (kg) *</Text>
      <TextInput
        style={styles.input}
        placeholder={`Max ${trip.remainingCapacity} kg`}
        value={cargoWeight}
        onChangeText={setCargoWeight}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Cargo Type *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Rice, Vegetables, Fish"
        value={cargoType}
        onChangeText={setCargoType}
        autoCapitalize="words"
      />

      {estimatedFare && (
        <View style={styles.estimate}>
          <Text style={styles.estimateLabel}>Estimated Fare</Text>
          <Text style={styles.estimateValue}>৳ {estimatedFare}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleBook} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm & Pay</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  content: { padding: 20 },
  tripSummary: {
    backgroundColor: '#16a085',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tripRoute: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 4 },
  tripMeta: { fontSize: 13, color: '#d4efdf' },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  estimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 14,
    marginTop: 18,
  },
  estimateLabel: { fontSize: 15, color: '#2e7d32', fontWeight: '600' },
  estimateValue: { fontSize: 15, color: '#2e7d32', fontWeight: '700' },
  button: {
    backgroundColor: '#16a085',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
