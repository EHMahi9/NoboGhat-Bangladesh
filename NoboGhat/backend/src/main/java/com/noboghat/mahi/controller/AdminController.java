package com.noboghat.mahi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.AdminDashboardDto;
import com.noboghat.mahi.dto.BookingSummaryDto;
import com.noboghat.mahi.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto getDashboard() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/bookings")
    public java.util.List<BookingSummaryDto> getBookings() {
        return adminService.getAllBookings();
    }
}
