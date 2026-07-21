package com.noboghat.mahi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationDto {
    private Long notificationId;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
