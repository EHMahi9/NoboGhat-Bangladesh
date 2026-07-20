package com.noboghat.mahi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.TripRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserService userService;

    public BookingService(BookingRepository bookingRepository, TripRepository tripRepository, UserService userService) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.userService = userService;
    }

    @Transactional
    public Booking createBooking(BookingDto bookingDto, String requester) {
        User user = userService.getUserByIdentifier(requester);
        Trip trip = tripRepository.findByIdForBooking(bookingDto.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found."));

        double reservedWeight = bookingRepository.totalReservedCargoWeight(trip.getTripId());
        double requestedWeight = bookingDto.getCargoWeight();
        double boatCapacity = trip.getBoat().getCapacity();
        if (reservedWeight + requestedWeight > boatCapacity) {
            throw new IllegalArgumentException("Capacity error: this booking exceeds the boat's remaining capacity.");
        }

        Booking booking = new Booking();
        booking.setCargoWeight(requestedWeight);
        booking.setStatus("PENDING");
        booking.setUser(user);
        booking.setTrip(trip);
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id, String requester, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        requireOwnerOrAdmin(booking, requester, isAdmin);
        return booking;
    }

    @Transactional
    public void cancelBooking(Long id, String requester, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        requireOwnerOrAdmin(booking, requester, isAdmin);

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new IllegalStateException("Booking is already cancelled.");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    private void requireOwnerOrAdmin(Booking booking, String requester, boolean isAdmin) {
        if (!isAdmin && !booking.getUser().getUserId().equals(userService.getUserByIdentifier(requester).getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can access only your own bookings.");
        }
    }
}
