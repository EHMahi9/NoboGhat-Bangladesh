package com.noboghat.mahi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.noboghat.mahi.model.Admin;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.NotificationRepository;
import com.noboghat.mahi.repository.PasswordResetTokenRepository;
import com.noboghat.mahi.repository.RouteRepository;
import com.noboghat.mahi.repository.TripRepository;
import com.noboghat.mahi.repository.UserRepository;

/**
 * Seeds the application with an ADMIN account.
 *
 * If the configured admin email does NOT exist, the seeder wipes the database
 * (to clear old phone-based/mismatched data) and creates the ADMIN user using
 * the injected {@code app.admin.email} / {@code app.admin.password} values.
 * If the admin already exists, nothing happens – data is preserved across restarts.
 *
 * Production-safety: the wipe is wrapped in a try-catch so a failure (e.g. a
 * DataIntegrityViolationException) is logged and never crashes application startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final BoatRepository boatRepository;
    private final RouteRepository routeRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataSeeder(UserRepository userRepository,
                      BookingRepository bookingRepository,
                      TripRepository tripRepository,
                      BoatRepository boatRepository,
                      RouteRepository routeRepository,
                      NotificationRepository notificationRepository,
                      PasswordResetTokenRepository passwordResetTokenRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.admin.email:}") String adminEmail,
                      @Value("${app.admin.password:}") String adminPassword) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.boatRepository = boatRepository;
        this.routeRepository = routeRepository;
        this.notificationRepository = notificationRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail == null ? "" : adminEmail.trim().toLowerCase();
        this.adminPassword = adminPassword == null ? "" : adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.warn("DataSeeder: app.admin.email / app.admin.password are not configured. Skipping admin seeding.");
            return;
        }

        if (userRepository.findByEmail(adminEmail).isPresent()) {
            log.info("DataSeeder: Admin {} already exists. Skipping database wipe and seeding.", adminEmail);
            return;
        }

        log.warn("DataSeeder: Admin {} not found. Wiping database and seeding fresh ADMIN.", adminEmail);

        // Production-safety: the wipe must never crash startup. Log and continue.
        try {
            wipeDatabase();
        } catch (Exception ex) {
            System.err.println("[DataSeeder] Database wipe failed (continuing with admin seeding): " + ex.getMessage());
            ex.printStackTrace(System.err);
        }

        // Admin creation always runs, even if the wipe failed or was skipped.
        try {
            Admin admin = new Admin();
            admin.setName("Mahi");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            userRepository.save(admin);
            log.info("DataSeeder: ADMIN user created with email {}", adminEmail);
        } catch (Exception ex) {
            System.err.println("[DataSeeder] Failed to create ADMIN user: " + ex.getMessage());
            ex.printStackTrace(System.err);
        }
    }

    /**
     * Deletes data in FK-safe order so no foreign-key constraint is violated:
     * PasswordResetToken → Booking → Trip → Boat → Notification → Route → User.
     * (PasswordResetToken, Booking, Notification and Boat all reference User, so
     * User is deleted last; Trip references Route and Boat, so they go before Trip.)
     */
    private void wipeDatabase() {
        passwordResetTokenRepository.deleteAllInBatch(); // references User
        bookingRepository.deleteAllInBatch();            // references User, Trip
        tripRepository.deleteAllInBatch();               // references Route, Boat
        boatRepository.deleteAllInBatch();               // references User
        notificationRepository.deleteAllInBatch();       // references User
        routeRepository.deleteAllInBatch();              // no FK, safe after Trip
        userRepository.deleteAllInBatch();               // no remaining children
        log.info("DataSeeder: Database wiped successfully.");
    }
}

