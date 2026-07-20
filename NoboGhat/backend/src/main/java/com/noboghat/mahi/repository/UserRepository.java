package com.noboghat.mahi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);
}
