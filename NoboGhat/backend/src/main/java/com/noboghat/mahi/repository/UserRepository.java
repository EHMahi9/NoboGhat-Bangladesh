package com.noboghat.mahi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.noboghat.mahi.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Modifying
    @Query(value = "UPDATE users SET role = :newRole WHERE user_id = :userId", nativeQuery = true)
    void updateUserRole(@Param("userId") Long userId, @Param("newRole") String newRole);
}
