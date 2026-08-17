package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.Boat;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    long countByOwnerUserId(Long userId);
}
