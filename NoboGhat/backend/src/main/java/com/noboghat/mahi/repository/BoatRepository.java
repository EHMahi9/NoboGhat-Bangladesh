package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.noboghat.mahi.model.Boat;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    long countByOwnerUserId(Long userId);
    Optional<Boat> findByName(String name);
}
