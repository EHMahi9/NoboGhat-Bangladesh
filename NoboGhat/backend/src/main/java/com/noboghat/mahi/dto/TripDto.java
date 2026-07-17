package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TripDto {
    @NotNull(message = "Route ID is required")
    private Long routeId;
    @NotNull(message = "Boat ID is required")
    private Long boatId;
}
