package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookingStatusUpdateDto {

    @NotBlank(message = "Status is required.")
    private String status;
}
