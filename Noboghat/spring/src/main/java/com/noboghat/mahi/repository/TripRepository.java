package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.noboghat.mahi.model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
}