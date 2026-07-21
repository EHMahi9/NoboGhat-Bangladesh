package com.noboghat.mahi.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateDto {
    @Size(min = 2, max = 100)
    private String name;

    @Pattern(regexp = "^[0-9+() -]{7,20}$")
    private String phone;

    @Size(min = 6, max = 100)
    private String currentPassword;

    @Size(min = 6, max = 100)
    private String newPassword;
}
