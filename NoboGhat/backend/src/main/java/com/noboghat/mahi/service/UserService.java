package com.noboghat.mahi.service;

import java.util.Collections;
import java.util.Locale;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.BoatOwner;
import com.noboghat.mahi.model.Farmer;
import com.noboghat.mahi.model.PasswordResetToken;
import com.noboghat.mahi.model.PendingUser;
import com.noboghat.mahi.model.Trader;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.PasswordResetTokenRepository;
import com.noboghat.mahi.repository.UserRepository;

import jakarta.persistence.EntityManager;

@Service
public class UserService implements UserDetailsService {
    private static final Map<String, String> PUBLIC_ROLES = Map.of(
            "farmer", "FARMER",
            "trader", "TRADER",
            "owner", "BOAT_OWNER",
            "boatowner", "BOAT_OWNER",
            "boat_owner", "BOAT_OWNER");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EntityManager entityManager,
            PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String normalized = identifier.trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(normalized)
                .or(() -> userRepository.findByPhone(normalized))
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        if (!user.isActive()) {
            throw new org.springframework.security.authentication.DisabledException("This account has been deactivated.");
        }

        return new org.springframework.security.core.userdetails.User(
                loginIdentifier(user),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return encodedPassword != null && passwordEncoder.matches(rawPassword, encodedPassword);
    }

    @Transactional
    public User updateUserRole(Long userId, String newRole) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found.");
        }

        String role = PUBLIC_ROLES.get(newRole.trim().toLowerCase(Locale.ROOT));
        if (role == null) {
            throw new IllegalArgumentException("Invalid role. Must be farmer, trader, or boat_owner.");
        }

        userRepository.updateUserRole(userId, role);
        entityManager.clear();
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found after role update."));
    }

    private String loginIdentifier(User user) {
        return user.getPhone() != null ? user.getPhone() : user.getEmail();
    }

    // existing methods unchanged...
}
