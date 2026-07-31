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

    // Inject PasswordEncoder to securely hash passwords
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EntityManager entityManager,
            PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    /**
     * Required by Spring Security to load a user during the login process.
     * We use the email address as the unique "username" for NoboGhat.
     */
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String normalized = identifier.trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(normalized)
                .or(() -> userRepository.findByPhone(normalized))
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        if (!user.isActive()) {
            throw new org.springframework.security.authentication.DisabledException("This account has been deactivated.");
        }

        // Map the NoboGhat User to a Spring Security UserDetails object
        // Prefix with ROLE_ so that hasRole("ADMIN") works correctly in Spring Security
        return new org.springframework.security.core.userdetails.User(
                loginIdentifier(user),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    public User registerGoogleUser(String email, String name) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        return userRepository.findByEmail(normalizedEmail).orElseGet(() -> {
            PendingUser user = new PendingUser();
            user.setName(name == null || name.isBlank() ? "Google user" : name.trim());
            user.setEmail(normalizedEmail);
            // Google users authenticate with Google; this value prevents a null
            // password column without granting password-based sign-in.
            user.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            return userRepository.save(user);
        });
    }

    public User getUserByIdentifier(String identifier) {
        String normalized = identifier.trim().toLowerCase(Locale.ROOT);
        return userRepository.findByEmail(normalized)
                .or(() -> userRepository.findByPhone(normalized))
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    /**
     * Soft-deletes the authenticated user by setting isActive = false.
     * This keeps the account row in the DB (for auditing/history) while
     * blocking future sign-ins via DisabledException in loadUserByUsername().
     */
    @Transactional
    public void deactivateAccount(String identifier) {
        User user = getUserByIdentifier(identifier);
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalStateException("Admin accounts cannot be deactivated.");
        }
        user.setActive(false);
        userRepository.save(user);
    }

    // ==================== Password Recovery (Task 3) ====================

    /** Generates a random OTP/token, persists it, and prints it to the server console. */
    @Transactional
    public String generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("No account is associated with that email address."));
        if (!user.isActive()) {
            throw new IllegalStateException("This account has been deactivated.");
        }

        // Invalidate any previously issued token for this user
        passwordResetTokenRepository.findByUserId(user.getUserId()).ifPresent(passwordResetTokenRepository::delete);

        String token = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(15));
        passwordResetTokenRepository.save(resetToken);

        // Mock delivery – print the token to the server console
        System.out.println("==========================================");
        System.out.println("NoboGhat password recovery token for " + email + ": " + token);
        System.out.println("Token expires in 15 minutes.");
        System.out.println("==========================================");
        return token;
    }

    /** Validates a token and updates the user's password. */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or unknown recovery token."));
        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("This recovery token has already been used.");
        }
        if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("This recovery token has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        resetToken.setUsed(true);
        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);
    }

    public User updateProfile(String identifier, String name, String phone, String currentPassword, String newPassword) {
        User user = getUserByIdentifier(identifier);

        if (name != null && !name.isBlank()) user.setName(name.trim());
        if (phone != null && !phone.isBlank() && !phone.trim().equals(user.getPhone())) {
            String normalizedPhone = phone.trim();
            userRepository.findByPhone(normalizedPhone).ifPresent(existing -> {
                if (!existing.getUserId().equals(user.getUserId())) {
                    throw new IllegalArgumentException("A user with this phone number already exists.");
                }
            });
            user.setPhone(normalizedPhone);
        }

        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || currentPassword.isBlank()) {
                throw new IllegalArgumentException("Current password is required to change your password.");
            }
            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
            user.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }

    private String loginIdentifier(User user) {
        return user.getPhone() != null ? user.getPhone() : user.getEmail();
    }

    @Transactional
    public User updateUserRole(Long userId, String newRole) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String role = PUBLIC_ROLES.get(newRole.trim().toLowerCase(Locale.ROOT));
        if (role == null) {
            throw new IllegalArgumentException("Invalid role. Must be farmer, trader, or boat_owner.");
        }

        // Update the discriminator column via native SQL since it's insertable=false, updatable=false
        userRepository.updateUserRole(userId, role);
        
        // Clear the persistence context so the entity is reloaded with the correct type
        entityManager.clear();
        
        // Reload the entity – JPA will now instantiate the correct subclass based on the new discriminator value
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found after role update."));
    }

    public User registerNewUser(UserRegistrationDto registrationDto) {
        // Check for duplicate email
        if (registrationDto.getEmail() != null && !registrationDto.getEmail().isBlank()
                && userRepository.existsByEmail(registrationDto.getEmail().trim().toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        String phone = registrationDto.getPhone() != null ? registrationDto.getPhone().trim() : null;
        if (phone != null && !phone.isBlank() && userRepository.findByPhone(phone).isPresent()) {
            throw new IllegalArgumentException("A user with this phone number already exists.");
        }

        String role = PUBLIC_ROLES.get(registrationDto.getRole().trim().toLowerCase(Locale.ROOT));
        if (role == null) {
            throw new IllegalArgumentException("Select Farmer, Trader, or Boat Owner as the role.");
        }

        // The database role is the JPA discriminator, so persist its matching
        // subtype rather than attempting to update a read-only discriminator.
        User user = switch (role) {
            case "FARMER" -> new Farmer();
            case "TRADER" -> new Trader();
            case "BOAT_OWNER" -> new BoatOwner();
            default -> throw new IllegalStateException("Unsupported user role.");
        };
        user.setName(registrationDto.getName().trim());
        if (phone != null && !phone.isBlank()) {
            user.setPhone(phone);
        }
        if (registrationDto.getEmail() != null && !registrationDto.getEmail().isBlank()) {
            user.setEmail(registrationDto.getEmail().trim().toLowerCase(Locale.ROOT));
        }
        
        // Phase 6 Implementation: Replaced the simple .hashCode() with BCrypt
        String password = registrationDto.getPassword();
        if (password != null && !password.isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    }
}
