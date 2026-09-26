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
        try {
            logger.info("Ensuring profile_picture_url is LONGTEXT to support Base64 avatars...");
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_picture_url LONGTEXT");
            logger.info("Successfully altered profile_picture_url column.");
        } catch (Exception e) {
            logger.warn("Could not alter users column: " + e.getMessage());
        }

        try {
            logger.info("Ensuring booked_at exists in bookings...");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN booked_at DATETIME DEFAULT CURRENT_TIMESTAMP");
            logger.info("Successfully added booked_at column.");
        } catch (Exception e) {
            logger.warn("Could not alter column (might already be LONGTEXT or unsupported dialect): " + e.getMessage());
            e.printStackTrace();
        }
    }
}

