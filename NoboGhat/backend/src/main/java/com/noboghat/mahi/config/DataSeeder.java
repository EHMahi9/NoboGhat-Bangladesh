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
 * Creates the configured administrator when it does not already exist.
 * This runner never removes or changes existing production data.
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

        java.util.Optional<User> existingUser = userRepository.findByEmail(adminEmail);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            boolean repaired = false;
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                userRepository.updateUserRole(user.getUserId(), "ADMIN");
                repaired = true;
            }
            if (!user.isActive()) {
                user.setActive(true);
                userRepository.save(user);
                repaired = true;
            }
            log.info("DataSeeder: configured admin {} already exists{}.", adminEmail,
                    repaired ? "; authorization repaired" : "; no changes required");
            return;
        }

        Admin admin = new Admin();
        admin.setName("Administrator");
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        userRepository.save(admin);
        log.info("DataSeeder: configured admin {} created.", adminEmail);
    }
}
