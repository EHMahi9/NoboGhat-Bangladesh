package com.noboghat.mahi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordDto {

    @NotBlank(message = "Email is required")
    @Email(message = "A valid email address is required")
    private String email;
}

