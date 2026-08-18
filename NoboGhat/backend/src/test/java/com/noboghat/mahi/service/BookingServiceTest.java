package com.noboghat.mahi.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.TripRepository;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Trip testTrip;
    private Boat testBoat;
    private Route testRoute;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("test@example.com");

        testBoat = new Boat();
        testBoat.setBoatId(1L);
        testBoat.setCapacity(500.0);

        testRoute = new Route();
        testRoute.setRouteId(1L);
        testRoute.setPricePerKg(10.0);

        testTrip = new Trip();
        testTrip.setTripId(1L);
        testTrip.setBoat(testBoat);
        testTrip.setRoute(testRoute);
        testTrip.setDepartureTime(LocalDateTime.now().plusDays(1));
    }

    @Test
    void testCreateBooking_Success() {
        BookingDto dto = new BookingDto();
        dto.setTripId(1L);
        dto.setCargoWeight(100.0);

        when(userService.getUserByIdentifier("test@example.com")).thenReturn(testUser);
        when(tripRepository.findByIdForBooking(1L)).thenReturn(Optional.of(testTrip));
        when(bookingRepository.totalReservedCargoWeight(1L)).thenReturn(200.0); // 200 + 100 < 500
        
        Booking savedBooking = new Booking();
        savedBooking.setBookingId(10L);
        savedBooking.setTotalFare(1000.0); // 100 * 10
        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        Booking result = bookingService.createBooking(dto, "test@example.com");

        assertNotNull(result);
        assertEquals(10L, result.getBookingId());
        verify(notificationService, times(1)).createForUser(eq("test@example.com"), anyString());
    }

    @Test
    void testCreateBooking_CapacityExceeded() {
        BookingDto dto = new BookingDto();
        dto.setTripId(1L);
        dto.setCargoWeight(400.0);

        when(userService.getUserByIdentifier("test@example.com")).thenReturn(testUser);
        when(tripRepository.findByIdForBooking(1L)).thenReturn(Optional.of(testTrip));
        when(bookingRepository.totalReservedCargoWeight(1L)).thenReturn(200.0); // 200 + 400 > 500 capacity

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(dto, "test@example.com");
        });

        assertTrue(exception.getMessage().contains("exceeds the boat's remaining capacity"));
        verify(bookingRepository, never()).save(any());
    }
}
