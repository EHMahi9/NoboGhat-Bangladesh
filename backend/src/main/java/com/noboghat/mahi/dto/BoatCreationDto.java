package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BoatCreationDto {
    @NotBlank(message = "Boat name is required")
    private String name;
    @NotNull(message = "Boat capacity is required")
    @Positive(message = "Boat capacity must be greater than zero")
    private Double capacity;
    private Long ownerId;
}
