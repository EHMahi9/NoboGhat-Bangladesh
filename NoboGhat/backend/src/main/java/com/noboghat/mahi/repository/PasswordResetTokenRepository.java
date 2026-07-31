package com.noboghat.mahi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUserId(Long userId);
}

