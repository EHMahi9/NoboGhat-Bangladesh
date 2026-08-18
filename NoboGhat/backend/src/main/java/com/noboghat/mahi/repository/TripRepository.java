package com.noboghat.mahi.repository;

import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.noboghat.mahi.model.Trip;

import jakarta.persistence.LockModeType;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Trip t join fetch t.boat where t.tripId = :tripId")
    Optional<Trip> findByIdForBooking(@Param("tripId") Long tripId);

    long countByBoatBoatId(Long boatId);

    boolean existsByRecurringScheduleScheduleIdAndDepartureTime(Long scheduleId, LocalDateTime departureTime);

    List<Trip> findByRecurringScheduleScheduleIdAndDepartureTimeAfter(Long scheduleId, LocalDateTime departureTime);

    @Query("SELECT t FROM Trip t JOIN t.route r " +
           "WHERE (:source IS NULL OR LOWER(r.source) LIKE LOWER(CONCAT('%', :source, '%'))) " +
           "AND (:destination IS NULL OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
           "AND (:date IS NULL OR CAST(t.departureTime AS date) = :date) " +
           "ORDER BY t.departureTime ASC")
    List<Trip> searchTrips(@Param("source") String source,
                           @Param("destination") String destination,
                           @Param("date") LocalDate date);
}

