package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.UserAdminDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final BoatRepository boatRepository;
    private final BookingRepository bookingRepository;

    public AdminUserService(UserRepository userRepository, BoatRepository boatRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.boatRepository = boatRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<UserAdminDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalStateException("Admin users cannot be deleted.");
        }
        if (bookingRepository.countByUserUserId(userId) > 0) {
            throw new IllegalStateException("User cannot be deleted because bookings already exist.");
        }
        if (boatRepository.countByOwnerUserId(userId) > 0) {
            throw new IllegalStateException("User cannot be deleted because boats already exist.");
        }
        userRepository.delete(user);
    }

    private UserAdminDto toDto(User user) {
        return new UserAdminDto(
                user.getUserId(),
                user.getName(),
                user.getPhone() == null ? "" : user.getPhone(),
                user.getEmail() == null ? "" : user.getEmail(),
                user.getRole(),
                boatRepository.countByOwnerUserId(user.getUserId()),
                bookingRepository.countByUserUserId(user.getUserId())
        );
    }
}
