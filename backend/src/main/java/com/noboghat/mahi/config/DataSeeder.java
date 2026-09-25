package com.noboghat.mahi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.model.Admin;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.UserRepository;

/**
 * Repairs or creates the configured administrator account.
 * This runner never removes existing production data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataSeeder(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail == null ? "" : adminEmail.trim().toLowerCase();
        this.adminPassword = adminPassword == null ? "" : adminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.info("DataSeeder: admin credentials are not configured; skipping admin seeding.");
            return;
        }

        User existing = userRepository.findByEmail(adminEmail).orElse(null);
        if (existing == null) {
            Admin admin = new Admin();
            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setActive(true);
            userRepository.save(admin);
            log.info("DataSeeder: configured admin {} created.", adminEmail);
            return;
        }

        boolean changed = false;
        if (!"ADMIN".equalsIgnoreCase(existing.getRole())) {
            userRepository.updateUserRole(existing.getUserId(), "ADMIN");
            changed = true;
        }
        if (!existing.isActive()) {
            existing.setActive(true);
            changed = true;
        }
        if (existing.getPasswordHash() == null || existing.getPasswordHash().isBlank() || !passwordEncoder.matches(adminPassword, existing.getPasswordHash())) {
            existing.setPasswordHash(passwordEncoder.encode(adminPassword));
            changed = true;
        }

        if (changed) {
            userRepository.save(existing);
            log.info("DataSeeder: configured admin {} verified and repaired.", adminEmail);
        } else {
            log.info("DataSeeder: configured admin {} already exists; no changes required.", adminEmail);
        }
    }
}
