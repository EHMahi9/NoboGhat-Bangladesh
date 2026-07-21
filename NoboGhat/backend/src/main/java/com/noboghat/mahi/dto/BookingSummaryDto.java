package com.noboghat.mahi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSummaryDto {
    private Long bookingId;
    private Double cargoWeight;
    private String status;
    private Long tripId;
    private String boatName;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
}
