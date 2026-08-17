package com.noboghat.mahi.config;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.BoatOwner;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.Notification;
import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.model.Trader;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.NotificationRepository;
import com.noboghat.mahi.repository.RouteRepository;
import com.noboghat.mahi.repository.TripRepository;
import com.noboghat.mahi.repository.UserRepository;

/**
 * Seeds a compact public dataset for demonstrations. Demo boats use a stable
 * name prefix, so this component can identify its own records without touching
 * real boats, routes, users, or bookings.
 */
@Component
@Order(-50)
public class WeeklyDemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(WeeklyDemoDataSeeder.class);
    private static final String DEMO_PREFIX = "DEMO · ";
    private static final ZoneId DEMO_ZONE = ZoneId.of("Asia/Dhaka");

    private final boolean enabled;
    private final BoatRepository boatRepository;
    private final RouteRepository routeRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String transporterEmail;
    private final String transporterPassword;
    private final String traderEmail;
    private final String traderPassword;

    public WeeklyDemoDataSeeder(@Value("${app.demo-data.enabled:false}") boolean enabled,
            BoatRepository boatRepository, RouteRepository routeRepository,
            TripRepository tripRepository, BookingRepository bookingRepository, NotificationRepository notificationRepository,
            UserRepository userRepository, PasswordEncoder passwordEncoder,
            @Value("${DEMO_TRANSPORTER_EMAIL:}") String transporterEmail,
            @Value("${DEMO_TRANSPORTER_PASSWORD:}") String transporterPassword,
            @Value("${DEMO_TRADER_EMAIL:}") String traderEmail,
            @Value("${DEMO_TRADER_PASSWORD:}") String traderPassword) {
        this.enabled = enabled;
        this.boatRepository = boatRepository;
        this.routeRepository = routeRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transporterEmail = normalize(transporterEmail);
        this.transporterPassword = transporterPassword == null ? "" : transporterPassword;
        this.traderEmail = normalize(traderEmail);
        this.traderPassword = traderPassword == null ? "" : traderPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled) {
            log.info("WeeklyDemoDataSeeder: demo data is disabled.");
            return;
        }

        LocalDate today = LocalDate.now(DEMO_ZONE);
        LocalDate monday = weekStart(today);
        int week = today.get(WeekFields.ISO.weekOfWeekBasedYear());
        int year = today.get(WeekFields.ISO.weekBasedYear());
        log.info("WeeklyDemoDataSeeder: enabled; current demo week is {}-W{}.", year, String.format("%02d", week));

        User transporter = findOrCreateTransporter();
        User trader = findOrCreateTrader();
        List<Boat> boats = DEMO_BOATS.stream().map(spec -> findOrCreateBoat(spec, transporter)).toList();
        List<Route> routes = DEMO_ROUTES.stream().map(this::findOrCreateRoute).toList();
        removePriorUnbookedDemoTrips(monday.atStartOfDay());

        int created = 0;
        java.util.ArrayList<Trip> weeklyTrips = new java.util.ArrayList<>();
        for (TripPattern pattern : TRIP_PATTERNS) {
            Route route = routes.get(pattern.routeIndex());
            Boat boat = boats.get(pattern.boatIndex());
            LocalDateTime departure = monday.plusDays(pattern.dayOffset()).atTime(pattern.departureTime());
            var existing = tripRepository.findByRouteRouteIdAndBoatBoatIdAndDepartureTime(
                    route.getRouteId(), boat.getBoatId(), departure);
            if (existing.isEmpty()) {
                Trip trip = new Trip();
                trip.setRoute(route);
                trip.setBoat(boat);
                trip.setDepartureTime(departure);
                weeklyTrips.add(tripRepository.save(trip));
                created++;
            } else {
                weeklyTrips.add(existing.get());
            }
        }

        seedBookingsAndNotifications(weeklyTrips, trader);

        if (created == 0) {
            log.info("WeeklyDemoDataSeeder: demo dataset already exists for {}-W{}; skipping trip creation.", year, String.format("%02d", week));
        } else {
            log.info("WeeklyDemoDataSeeder: created {} deterministic trips for {}-W{}.", created, year, String.format("%02d", week));
        }
    }

    private Boat findOrCreateBoat(BoatSpec spec, User owner) {
        Boat boat = boatRepository.findByName(DEMO_PREFIX + spec.name()).orElseGet(() -> {
            Boat createdBoat = new Boat();
            createdBoat.setName(DEMO_PREFIX + spec.name());
            createdBoat.setCapacity(spec.capacityKg());
            return boatRepository.save(createdBoat);
        });
        if (owner != null && boat.getOwner() == null) {
            boat.setOwner(owner);
            return boatRepository.save(boat);
        }
        return boat;
    }

    private Route findOrCreateRoute(RouteSpec spec) {
        return routeRepository.findBySourceAndDestination(spec.source(), spec.destination()).orElseGet(() -> {
            Route route = new Route();
            route.setSource(spec.source());
            route.setDestination(spec.destination());
            return routeRepository.save(route);
        });
    }

    private void removePriorUnbookedDemoTrips(LocalDateTime weekStart) {
        List<Trip> oldTrips = tripRepository.findByBoatNameStartingWithAndDepartureTimeBefore(DEMO_PREFIX, weekStart);
        int removed = 0;
        for (Trip trip : oldTrips) {
            if (bookingRepository.countByTripTripId(trip.getTripId()) == 0) {
                tripRepository.delete(trip);
                removed++;
            }
        }
        if (removed > 0) log.info("WeeklyDemoDataSeeder: removed {} prior unbooked demo trips.", removed);
    }

    private User findOrCreateTransporter() {
        if (transporterEmail.isBlank() || transporterPassword.isBlank()) return null;
        return userRepository.findByEmail(transporterEmail).orElseGet(() -> {
            BoatOwner user = new BoatOwner();
            user.setName("NoboGhat Demo Transporter");
            user.setEmail(transporterEmail);
            user.setPasswordHash(passwordEncoder.encode(transporterPassword));
            return userRepository.save(user);
        });
    }

    private User findOrCreateTrader() {
        if (traderEmail.isBlank() || traderPassword.isBlank()) return null;
        return userRepository.findByEmail(traderEmail).orElseGet(() -> {
            Trader user = new Trader();
            user.setName("NoboGhat Demo Trader");
            user.setEmail(traderEmail);
            user.setPasswordHash(passwordEncoder.encode(traderPassword));
            return userRepository.save(user);
        });
    }

    private void seedBookingsAndNotifications(List<Trip> trips, User trader) {
        if (trader == null) {
            log.info("WeeklyDemoDataSeeder: demo credentials are not configured; skipping demo bookings and notifications.");
            return;
        }
        for (BookingPattern pattern : BOOKING_PATTERNS) {
            Trip trip = trips.get(pattern.tripIndex());
            if (!bookingRepository.existsByUserUserIdAndTripTripId(trader.getUserId(), trip.getTripId())) {
                Booking booking = new Booking();
                booking.setUser(trader);
                booking.setTrip(trip);
                booking.setCargoWeight(pattern.cargoWeight());
                booking.setStatus(pattern.status());
                bookingRepository.save(booking);
            }
            String message = "Demo booking: " + pattern.cargoDescription() + " on " + trip.getDepartureTime().toLocalDate() + ".";
            if (notificationRepository.findByUserUserIdAndMessage(trader.getUserId(), message).isEmpty()) {
                Notification notification = new Notification();
                notification.setUser(trader);
                notification.setMessage(message);
                notificationRepository.save(notification);
            }
        }
    }

    static LocalDate weekStart(LocalDate date) {
        return date.with(DayOfWeek.MONDAY);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private record BoatSpec(String name, double capacityKg) { }
    private record RouteSpec(String source, String destination) { }
    private record TripPattern(int dayOffset, LocalTime departureTime, int routeIndex, int boatIndex) { }
    private record BookingPattern(int tripIndex, double cargoWeight, String status, String cargoDescription) { }

    private static final List<BoatSpec> DEMO_BOATS = List.of(
            new BoatSpec("MV Padma Pioneer", 8000), new BoatSpec("MV Meghna Express", 6500),
            new BoatSpec("MV Buriganga Star", 5000), new BoatSpec("MV Karnaphuli Trader", 9000),
            new BoatSpec("MV Shitalakkhya", 4200), new BoatSpec("MV Surma Carrier", 7200),
            new BoatSpec("MV Rupsha Logistics", 6000), new BoatSpec("MV Arial Khan", 4800));

    private static final List<RouteSpec> DEMO_ROUTES = List.of(
            new RouteSpec("Dhaka (Sadarghat)", "Barisal"), new RouteSpec("Dhaka (Sadarghat)", "Chandpur"),
            new RouteSpec("Dhaka (Sadarghat)", "Bhola"), new RouteSpec("Narayanganj", "Chandpur"),
            new RouteSpec("Barisal", "Patuakhali"), new RouteSpec("Barisal", "Bhola"),
            new RouteSpec("Chandpur", "Shariatpur"), new RouteSpec("Munshiganj", "Dhaka (Sadarghat)"),
            new RouteSpec("Khulna", "Barisal"), new RouteSpec("Narayanganj", "Munshiganj"));

    private static final List<TripPattern> TRIP_PATTERNS = List.of(
            new TripPattern(0, LocalTime.of(7, 30), 0, 0), new TripPattern(0, LocalTime.of(15, 0), 1, 1),
            new TripPattern(1, LocalTime.of(8, 0), 2, 3), new TripPattern(1, LocalTime.of(16, 30), 3, 4),
            new TripPattern(2, LocalTime.of(6, 45), 4, 2), new TripPattern(2, LocalTime.of(11, 0), 5, 5), new TripPattern(2, LocalTime.of(17, 15), 6, 6),
            new TripPattern(3, LocalTime.of(8, 30), 7, 7), new TripPattern(3, LocalTime.of(14, 30), 8, 3),
            new TripPattern(4, LocalTime.of(7, 0), 9, 1), new TripPattern(4, LocalTime.of(10, 30), 0, 0), new TripPattern(4, LocalTime.of(18, 0), 1, 4),
            new TripPattern(5, LocalTime.of(8, 15), 2, 5), new TripPattern(5, LocalTime.of(15, 30), 3, 6),
            new TripPattern(6, LocalTime.of(9, 0), 4, 2));

    private static final List<BookingPattern> BOOKING_PATTERNS = List.of(
            new BookingPattern(0, 1200, "CONFIRMED", "rice"), new BookingPattern(1, 850, "PENDING", "vegetables"),
            new BookingPattern(2, 1800, "CONFIRMED", "potatoes"), new BookingPattern(4, 650, "PENDING", "onions"),
            new BookingPattern(6, 1400, "CONFIRMED", "jute"), new BookingPattern(8, 900, "PENDING", "fish"),
            new BookingPattern(10, 1100, "CONFIRMED", "fruit"), new BookingPattern(12, 700, "PENDING", "general goods"));
}
