package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RouteDto {
    @NotBlank(message = "Route source is required")
    private String source;

    @NotBlank(message = "Route destination is required")
    private String destination;
}

