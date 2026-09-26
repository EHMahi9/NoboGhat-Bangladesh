package com.noboghat.mahi.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseMigrationRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationRunner.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void run() {
        // 1. Ensure profile_picture_url is LONGTEXT to support Base64 avatars
        try {
            logger.info("Ensuring profile_picture_url is LONGTEXT to support Base64 avatars...");
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_picture_url LONGTEXT");
            logger.info("Successfully altered profile_picture_url column.");
        } catch (Exception e) {
            logger.warn("Could not alter users column: " + e.getMessage());
        }

        // 2. Ensure booked_at exists in bookings table
        try {
            logger.info("Ensuring booked_at exists in bookings...");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN booked_at DATETIME DEFAULT CURRENT_TIMESTAMP");
            logger.info("Successfully added booked_at column.");
        } catch (Exception e) {
            logger.warn("Could not add booked_at column: " + e.getMessage());
        }

        // 3. Ensure routes have a non-null pricePerKg so bookings have valid fare calculation
        try {
            logger.info("Ensuring all routes have a baseline price_per_kg...");
            jdbcTemplate.execute("UPDATE routes SET price_per_kg = 10.0 WHERE price_per_kg IS NULL OR price_per_kg <= 0");
            logger.info("Successfully updated default route pricing.");
        } catch (Exception e) {
            logger.warn("Could not update route price_per_kg: " + e.getMessage());
        }

        // 4. Backfill any existing bookings that have null or zero total_fare
        try {
            logger.info("Ensuring existing bookings have non-zero total_fare...");
            jdbcTemplate.execute("UPDATE bookings SET total_fare = ROUND(COALESCE(cargo_weight, 1.0) * 10.0, 2) WHERE total_fare IS NULL OR total_fare <= 0");
            logger.info("Successfully backfilled booking fares.");
        } catch (Exception e) {
            logger.warn("Could not backfill booking total_fare: " + e.getMessage());
        }
    }
}
