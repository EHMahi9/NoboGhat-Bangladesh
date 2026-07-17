package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Phone number is invalid")
    private String phone;
    @NotBlank(message = "Role is required")
    private String role;
}
