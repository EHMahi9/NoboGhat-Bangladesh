package com.noboghat.mahi.service;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.AdminDashboardDto;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BoatRepository boatRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository, BoatRepository boatRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.boatRepository = boatRepository;
        this.bookingRepository = bookingRepository;
    }

    public AdminDashboardDto getDashboardStats() {
        long users = userRepository.count();
        long boats = boatRepository.count();
        long bookings = bookingRepository.count();
        
        // সব বুকিংয়ের মোট ওজন হিসেব করা
        double totalWeight = bookingRepository.findAll().stream()
                             .mapToDouble(b -> b.getCargoWeight())
                             .sum();

        return new AdminDashboardDto(users, boats, bookings, totalWeight);
    }
}