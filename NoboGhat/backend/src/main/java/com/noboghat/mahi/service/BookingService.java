package com.noboghat.mahi.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

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
    @CacheEvict(value = "trips", allEntries = true)
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
        booking.setCargoType(bookingDto.getCargoType() != null ? bookingDto.getCargoType().trim() : "General");
        booking.setStatus("PENDING");
        booking.setUser(user);
        booking.setTrip(trip);
        // Compute fare if route has a price set
        if (trip.getRoute() != null && trip.getRoute().getPricePerKg() != null) {
            booking.setTotalFare(requestedWeight * trip.getRoute().getPricePerKg());
        }
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

    @Transactional(readOnly = true)
    public List<BookingSummaryDto> getBookingsForBoatOwner(String requester) {
        User user = userService.getUserByIdentifier(requester);
        return bookingRepository.findByTrip_Boat_Owner_UserId(user.getUserId())
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "trips", allEntries = true)
    public void cancelBooking(Long id, String requester, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        requireOwnerOrAdmin(booking, requester, isAdmin);

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new IllegalStateException("Booking is already cancelled.");
        }

        // Enforce 2-hour cancellation window (admins bypass this)
        if (!isAdmin) {
            java.time.LocalDateTime departure = booking.getTrip().getDepartureTime();
            if (departure != null && departure.isBefore(java.time.LocalDateTime.now().plusHours(2))) {
                throw new IllegalStateException("Bookings cannot be cancelled within 2 hours of departure.");
            }
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    @Transactional
    @CacheEvict(value = "trips", allEntries = true)
    public BookingSummaryDto updateBookingStatus(Long id, BookingStatusUpdateDto statusUpdateDto, String requester, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        if (!isAdmin) {
            User requestUser = userService.getUserByIdentifier(requester);
            boolean isBoatOwner = "ROLE_BOAT_OWNER".equals(requestUser.getRole());
            boolean ownsBoat = booking.getTrip().getBoat().getOwner() != null 
                && booking.getTrip().getBoat().getOwner().getUserId().equals(requestUser.getUserId());
            
            if (!isBoatOwner || !ownsBoat) {
                throw new org.springframework.security.access.AccessDeniedException("Only administrators or the owner of the boat can update booking status.");
            }
        }

        String desiredStatus = statusUpdateDto.getStatus() == null ? "" : statusUpdateDto.getStatus().trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(desiredStatus)) {
            throw new IllegalArgumentException("Unsupported booking status: " + statusUpdateDto.getStatus());
        }

        booking.setStatus(desiredStatus);
        BookingSummaryDto result = toSummaryDto(bookingRepository.save(booking));
        // Notify the booking owner about the status change
        String ownerIdentifier = booking.getUser().getEmail() != null
                ? booking.getUser().getEmail()
                : booking.getUser().getPhone();
        if (ownerIdentifier != null) {
            notificationService.createForUser(ownerIdentifier,
                    "Your booking #" + id + " has been updated to: " + desiredStatus + ".");
        }
        return result;

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
                booking.getCargoType(),
                booking.getStatus(),
                trip.getTripId(),
                trip.getBoat() != null ? trip.getBoat().getName() : "",
                trip.getRoute() != null ? trip.getRoute().getSource() : "",
                trip.getRoute() != null ? trip.getRoute().getDestination() : "",
                trip.getDepartureTime(),
                booking.getBookedAt(),
                booking.getTotalFare()
        );
    }
}
