package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @NotBlank(message = "Name is required")
    private String name;

    // TODO: Implement mobile number OTP verification later
    // @NotBlank(message = "Phone number is required")
    // @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Phone number is invalid")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be at least 4 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    private String email;
}
