package com.noboghat.mahi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Flat DTO for public trip listings. Mirrors the old nested (trip.boat.*)
 * shape the frontend expects, but adds a precomputed remainingCapacity field
 * so the client no longer needs to calculate capacity itself.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripWithCapacityDto {
    private Long tripId;
    private Long routeId;
    private String source;
    private String destination;
    private Long boatId;
    private String boatName;
    private Double boatCapacity;
    private LocalDateTime departureTime;
    private Double remainingCapacity;
    private Double pricePerKg;
}

