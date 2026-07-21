package com.noboghat.mahi.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.BookingSummaryDto;
import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.dto.BookingStatusUpdateDto;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.TripRepository;

@Service
public class BookingService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "CONFIRMED", "CANCELLED");

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, TripRepository tripRepository, UserService userService, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.userService = userService;
        this.notificationService = notificationService;
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
        Booking saved = bookingRepository.save(booking);
        notificationService.createForUser(requester, "Your booking for trip #" + trip.getTripId() + " has been created.");
        return saved;
    }

    public Booking getBookingById(Long id, String requester, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        requireOwnerOrAdmin(booking, requester, isAdmin);
        return booking;
    }

    @Transactional(readOnly = true)
    public List<BookingSummaryDto> getBookingsForUser(String requester) {
        User user = userService.getUserByIdentifier(requester);
        return bookingRepository.findAllByUserUserIdOrderByBookingIdDesc(user.getUserId())
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingSummaryDto> getAllBookingsForAdmin() {
        return bookingRepository.findAll().stream().map(this::toSummaryDto).toList();
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

    @Transactional
    public BookingSummaryDto updateBookingStatus(Long id, BookingStatusUpdateDto statusUpdateDto, String requester, boolean isAdmin) {
        if (!isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Only administrators can update booking status.");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        String desiredStatus = statusUpdateDto.getStatus() == null ? "" : statusUpdateDto.getStatus().trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(desiredStatus)) {
            throw new IllegalArgumentException("Unsupported booking status: " + statusUpdateDto.getStatus());
        }

        booking.setStatus(desiredStatus);
        return toSummaryDto(bookingRepository.save(booking));
    }

    private void requireOwnerOrAdmin(Booking booking, String requester, boolean isAdmin) {
        if (!isAdmin && !booking.getUser().getUserId().equals(userService.getUserByIdentifier(requester).getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can access only your own bookings.");
        }
    }

    private BookingSummaryDto toSummaryDto(Booking booking) {
        Trip trip = booking.getTrip();
        return new BookingSummaryDto(
                booking.getBookingId(),
                booking.getCargoWeight(),
                booking.getStatus(),
                trip.getTripId(),
                trip.getBoat() != null ? trip.getBoat().getName() : "",
                trip.getRoute() != null ? trip.getRoute().getSource() : "",
                trip.getRoute() != null ? trip.getRoute().getDestination() : "",
                trip.getDepartureTime()
        );
    }
}
