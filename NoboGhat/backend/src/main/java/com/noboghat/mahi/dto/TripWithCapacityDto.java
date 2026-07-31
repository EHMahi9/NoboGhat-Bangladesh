package com.noboghat.mahi.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TripWithCapacityDto {
    private Long tripId;
    private Long routeId;
    private String source;
    private String destination;
    private Long boatId;
    private String boatName;
    private Double boatCapacity;
    private LocalDateTime departureTime;
    private double remainingCapacity;
}

