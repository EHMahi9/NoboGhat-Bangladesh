package com.noboghat.mahi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

/**
 * Applies small, idempotent schema corrections needed by existing deployments.
 * Skips MySQL-specific migrations when running on H2 (local development).
 */
@Component
@Order(-100)
public class DatabaseSchemaMigrator implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaMigrator.class);

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    public DatabaseSchemaMigrator(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        // Detect database type to avoid running MySQL-specific queries on H2 (local dev)
        String dbProductName = getDatabaseProductName();
        if (dbProductName == null || !dbProductName.toLowerCase().contains("mysql")) {
            log.info("DatabaseSchemaMigrator: non-MySQL database detected ({}); skipping MySQL-specific migrations.", dbProductName);
            return;
        }

        try {
            String nullable = jdbcTemplate.queryForObject(
                    "SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS "
                            + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone'",
                    String.class);

            if ("NO".equalsIgnoreCase(nullable)) {
                jdbcTemplate.execute("ALTER TABLE users MODIFY phone VARCHAR(20) NULL");
                log.info("DatabaseSchemaMigrator: made users.phone nullable for Google sign-in.");
            }
        } catch (Exception e) {
            // Non-fatal: log and continue. The column may not exist yet (fresh DB).
            log.warn("DatabaseSchemaMigrator: could not check/modify users.phone: {}", e.getMessage());
        }
    }

    private String getDatabaseProductName() {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            return meta.getDatabaseProductName();
        } catch (Exception e) {
            log.warn("DatabaseSchemaMigrator: could not detect database type: {}", e.getMessage());
            return null;
        }
    }
}
