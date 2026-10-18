// NoboGhat Mobile API Contracts (Mirrors Spring Boot DTOs directly)

export type UserRole = 'FARMER' | 'TRADER' | 'BOAT_OWNER' | 'ADMIN';

// Auth DTOs (Mirrors LoginDto.java and UserRegistrationDto.java)
export interface LoginRequest {
  email: string; // Accepts email or phone identifier
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  role: string; // 'farmer' | 'trader' | 'boat_owner' or uppercase
}

export interface RegisterResponse {
  message: string;
  userId?: number;
  role?: string;
}

// User Profile (Mirrors ProfileController.java)
export interface UserProfile {
  userId: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  profilePictureUrl: string;
}

// Trip DTO (Mirrors TripWithCapacityDto.java)
export interface TripWithCapacity {
  tripId: number;
  routeId: number;
  source: string;
  destination: string;
  boatId: number;
  boatName: string;
  boatCapacity: number;
  departureTime: string;
  remainingCapacity: number;
  pricePerKg: number;
}

// Booking DTOs (Mirrors BookingDto.java and BookingSummaryDto.java)
export interface BookingRequest {
  tripId: number;
  cargoWeight: number;
  cargoType: string;
}

export interface BookingSummary {
  bookingId: number;
  cargoWeight: number;
  cargoType: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | string;
  tripId: number;
  boatName: string;
  source: string;
  destination: string;
  departureTime: string;
  bookedAt: string;
  totalFare: number;
}

// Payment DTOs (Mirrors PaymentTransaction.java and PaymentController.java)
export interface PaymentInitiateRequest {
  bookingId: number;
  gateway?: string;
}

export interface PaymentTransaction {
  transactionId: number;
  transactionRef: string;
  amount: number;
  status: string;
  gateway: string;
}

export interface PaymentWebhookRequest {
  transactionRef: string;
  status: 'SUCCESS' | 'FAILED';
}

export type TripWithCapacityDto = TripWithCapacity;
export type BookingSummaryDto = BookingSummary;
export type PaymentInitiateResponseDto = PaymentTransaction;

// Navigation Param List
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  TripsList: undefined;
  TripDetail: { trip: TripWithCapacity };
  CreateBooking: { trip: TripWithCapacity };
  Payment: {
    bookingId: number;
    transactionRef: string;
    amount: number;
    gateway?: string;
  };
  MyBookings: undefined;
};
