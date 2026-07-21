package com.noboghat.mahi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.noboghat.mahi.dto.AdminDashboardDto;
import com.noboghat.mahi.dto.BookingSummaryDto;
import com.noboghat.mahi.dto.UserAdminDto;
import com.noboghat.mahi.dto.TripDto;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.service.AdminService;
import com.noboghat.mahi.service.AdminUserService;
import com.noboghat.mahi.service.TripService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final TripService tripService;
    private final AdminUserService adminUserService;

    public AdminController(AdminService adminService, TripService tripService, AdminUserService adminUserService) {
        this.adminService = adminService;
        this.tripService = tripService;
        this.adminUserService = adminUserService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto getDashboard() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/bookings")
    public java.util.List<BookingSummaryDto> getBookings() {
        return adminService.getAllBookings();
    }

    @GetMapping("/trips")
    public java.util.List<Trip> getTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/users")
    public java.util.List<UserAdminDto> getUsers() {
        return adminUserService.getAllUsers();
    }

    @PostMapping("/trips")
    @ResponseStatus(HttpStatus.CREATED)
    public Trip createTrip(@Valid @RequestBody TripDto tripDto) {
        return tripService.createTrip(tripDto);
    }

    @DeleteMapping("/trips/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
    }
}
