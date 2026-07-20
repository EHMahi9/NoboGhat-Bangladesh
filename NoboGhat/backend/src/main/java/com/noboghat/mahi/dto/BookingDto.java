package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BookingDto {
    @NotNull(message = "Trip ID is required")
    private Long tripId;
    @NotNull(message = "Cargo weight is required")
    @Positive(message = "Cargo weight must be greater than zero")
    private Double cargoWeight;
}
