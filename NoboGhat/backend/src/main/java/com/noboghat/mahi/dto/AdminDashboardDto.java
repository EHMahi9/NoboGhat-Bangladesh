package com.noboghat.mahi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long totalBoats;
    private long totalBookings;
    private double totalCargoWeight;
}