package com.noboghat.mahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.noboghat.mahi.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select coalesce(sum(b.cargoWeight), 0) from Booking b "
            + "where b.trip.tripId = :tripId and b.status in ('PENDING', 'CONFIRMED')")
    double totalReservedCargoWeight(@Param("tripId") Long tripId);

    List<Booking> findAllByUserUserIdOrderByBookingIdDesc(Long userId);

    long countByTripTripId(Long tripId);

    long countByUserUserId(Long userId);
}
