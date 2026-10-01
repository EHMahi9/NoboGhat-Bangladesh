import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import apiClient from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ route, navigation }: Props) {
  const { bookingId, transactionRef, amount, gateway } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = async (status: 'SUCCESS' | 'FAILED') => {
    setLoading(true);
    try {
      // POST /api/payments/webhook with auth token attached automatically via apiClient interceptor
      await apiClient.post('/payments/webhook', {
        transactionRef,
        status,
      });

      if (status === 'SUCCESS') {
        Alert.alert(
          'Payment Successful',
          `Booking #${bookingId} has been confirmed. Total paid: ৳${amount.toFixed(2)}`,
          [
            {
              text: 'View My Bookings',
              onPress: () => navigation.replace('MyBookings'),
            },
          ]
        );
      } else {
        Alert.alert('Payment Failed', 'The payment was marked as failed or cancelled.', [
          {
            text: 'Go to Trips',
            onPress: () => navigation.navigate('TripsList'),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert(
        'Payment Processing Error',
        err?.response?.data?.message ?? err?.message ?? 'Payment failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.gatewayBadge}>{gateway || 'SSLCommerz'} Gateway</Text>
        <Text style={styles.title}>Complete Payment</Text>
        <Text style={styles.amount}>৳ {amount.toFixed(2)}</Text>
        
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>#{bookingId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction Ref</Text>
          <Text style={styles.value}>{transactionRef}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.successBtn]}
        onPress={() => handlePay('SUCCESS')}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Pay ৳{amount.toFixed(2)}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelBtn]}
        onPress={() => handlePay('FAILED')}
        disabled={loading}
      >
        <Text style={styles.cancelBtnText}>Cancel Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gatewayBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#16a085',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  successBtn: {
    backgroundColor: '#16a085',
  },
  cancelBtn: {
    backgroundColor: '#fce4ec',
    borderWidth: 1,
    borderColor: '#f8bbd0',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtnText: {
    color: '#c2185b',
    fontSize: 15,
    fontWeight: '600',
  },
});
