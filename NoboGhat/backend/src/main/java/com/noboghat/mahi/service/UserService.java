package com.noboghat.mahi.service;

import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class UserService {
    private static final Map<String, String> PUBLIC_ROLES = Map.of(
            "farmer", "FARMER",
            "trader", "TRADER",
            "owner", "BOAT_OWNER",
            "boatowner", "BOAT_OWNER",
            "boat_owner", "BOAT_OWNER");

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Mock login for Phase 6 pre-implementation.
     * Validates that the phone exists in the system.
     */
    public User loginUser(String phone, String password) {
        return userRepository.findByPhone(phone.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid phone number or password."));
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

        User user = new User();
        user.setName(registrationDto.getName().trim());
        user.setPhone(phone);
        user.setRole(role);
        return userRepository.save(user);
    }
}
