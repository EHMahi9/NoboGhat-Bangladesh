import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TripsListScreen from '../screens/TripsListScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, logout, role } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.brandTitle}>নৌঘাট</Text>
        <Text style={styles.brandSubtitle}>NoboGhat Cargo Logistics</Text>
        <ActivityIndicator size="large" color="#16a085" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F4C81',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="TripsList"
            component={TripsListScreen}
            options={({ navigation }) => ({
              title: 'Available Cargo Trips',
              headerRight: () => (
                <View style={styles.headerRightRow}>
                  <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => navigation.navigate('MyBookings')}
                  >
                    <Text style={styles.headerBtnText}>Bookings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.headerBtn, styles.logoutBtn]}
                    onPress={() => logout()}
                  >
                    <Text style={styles.headerBtnText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="TripDetail"
            component={TripDetailScreen}
            options={{ title: 'Trip Details' }}
          />
          <Stack.Screen
            name="CreateBooking"
            component={CreateBookingScreen}
            options={{ title: 'Book Cargo Space' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Complete Payment' }}
          />
          <Stack.Screen
            name="MyBookings"
            component={MyBookingsScreen}
            options={({ navigation }) => ({
              title: 'My Bookings',
              headerRight: () => (
                <TouchableOpacity
                  style={[styles.headerBtn, styles.logoutBtn]}
                  onPress={() => logout()}
                >
                  <Text style={styles.headerBtnText}>Logout</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F4C81',
  },
  brandSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#16a085',
    marginTop: 6,
  },
  headerRightRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  logoutBtn: {
    backgroundColor: 'rgba(231, 76, 60, 0.4)',
  },
  headerBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
