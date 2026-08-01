package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecurringTripScheduleDto {
    @NotNull private Long routeId;
    @NotNull private Long boatId;
    @NotBlank private String dayOfWeek;
    @NotBlank private String departureTime;
}
