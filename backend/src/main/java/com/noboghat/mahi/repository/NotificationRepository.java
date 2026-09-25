package com.noboghat.mahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserUserIdAndIsReadFalse(Long userId);
}
