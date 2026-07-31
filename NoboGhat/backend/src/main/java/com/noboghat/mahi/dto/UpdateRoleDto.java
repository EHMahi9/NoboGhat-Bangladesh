package com.noboghat.mahi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRoleDto {
    @NotBlank(message = "Role is required")
    private String role;
}