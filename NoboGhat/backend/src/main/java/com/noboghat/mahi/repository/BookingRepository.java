package com.noboghat.mahi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.noboghat.mahi.model.Booking;

import jakarta.persistence.LockModeType;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select coalesce(sum(b.cargoWeight), 0.0) from Booking b "
            + "where b.trip.tripId = :tripId and b.status in ('PENDING', 'CONFIRMED')")
    double totalReservedCargoWeight(@Param("tripId") Long tripId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.trip t LEFT JOIN FETCH t.boat LEFT JOIN FETCH t.route WHERE b.user.userId = :userId ORDER BY b.bookingId DESC")
    List<Booking> findAllByUserUserIdOrderByBookingIdDesc(@Param("userId") Long userId);

    long countByTripTripId(Long tripId);

    long countByUserUserId(Long userId);

    long countByTrip_Boat_Owner_UserId(Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.trip t LEFT JOIN FETCH t.boat LEFT JOIN FETCH t.route WHERE t.boat.owner.userId = :userId ORDER BY b.bookingId DESC")
    List<Booking> findByTrip_Boat_Owner_UserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.trip t LEFT JOIN FETCH t.boat LEFT JOIN FETCH t.route ORDER BY b.bookingId DESC")
    List<Booking> findAllWithDetails();

    @Query("SELECT COALESCE(SUM(b.cargoWeight), 0.0) FROM Booking b")
    double sumAllCargoWeight();
}
