package com.noboghat.mahi.dto;

import lombok.Data;

@Data
public class BoatCreationDto {
    private String name;
    private Double capacity;
    private Long ownerId;
}
