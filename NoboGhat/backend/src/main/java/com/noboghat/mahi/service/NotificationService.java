package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.NotificationDto;
import com.noboghat.mahi.model.Notification;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.NotificationRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Transactional
    public void createForUser(String identifier, String message) {
        User user = userService.getUserByIdentifier(identifier);
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getForUser(String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(n -> new NotificationDto(n.getNotificationId(), n.getMessage(), n.isRead(), n.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        return notificationRepository.countByUserUserIdAndIsReadFalse(user.getUserId());
    }

    @Transactional
    public void markRead(Long id, String identifier) {
        User user = userService.getUserByIdentifier(identifier);
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));
        if (!n.getUser().getUserId().equals(user.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can access only your own notifications.");
        }
        n.setRead(true);
        n.setReadAt(java.time.LocalDateTime.now());
        notificationRepository.save(n);
    }
}
