package com.noboghat.mahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.RecurringTripSchedule;

public interface RecurringTripScheduleRepository extends JpaRepository<RecurringTripSchedule, Long> {
    List<RecurringTripSchedule> findByActiveTrue();
}
