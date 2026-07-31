package com.noboghat.mahi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAdminDto {
    private Long userId;
    private String name;
    private String phone;
    private String email;
    private String role;
    private long boatCount;
    private long bookingCount;
}
