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

import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.BoatOwner;
import com.noboghat.mahi.model.Farmer;
import com.noboghat.mahi.model.Trader;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.UserRepository;

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

    // Inject PasswordEncoder to securely hash passwords
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Required by Spring Security to load a user during the login process.
     * We use the phone number as the unique "username" for NoboGhat.
     */
    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        User user = userRepository.findByPhone(phone.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone number: " + phone));

        // Map the NoboGhat User to a Spring Security UserDetails object
        return new org.springframework.security.core.userdetails.User(
                user.getPhone(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }

    public User registerNewUser(UserRegistrationDto registrationDto) {
        String phone = registrationDto.getPhone().trim();
        if (userRepository.findByPhone(phone).isPresent()) {
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
        user.setPhone(phone);
        
        // Phase 6 Implementation: Replaced the simple .hashCode() with BCrypt
        String password = registrationDto.getPassword();
        if (password != null && !password.isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    }
}
