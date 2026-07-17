package com.noboghat.mahi.dto;

import lombok.Data;

@Data
public class BookingDto {
    private Long userId;
    private Long tripId;
    private Double cargoWeight;
}