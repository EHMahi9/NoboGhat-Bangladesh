package com.noboghat.mahi.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.TripDto;
import com.noboghat.mahi.dto.TripWithCapacityDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.RouteRepository;
import com.noboghat.mahi.repository.TripRepository;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BoatRepository boatRepository;
    private final BookingRepository bookingRepository;

    public TripService(TripRepository tripRepository, RouteRepository routeRepository, BoatRepository boatRepository, BookingRepository bookingRepository) {
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.boatRepository = boatRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Trip createTrip(TripDto tripDto) {
        Route route = routeRepository.findById(tripDto.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found."));
        Boat boat = boatRepository.findById(tripDto.getBoatId())
                .orElseThrow(() -> new IllegalArgumentException("Boat not found."));

        Trip trip = new Trip();
        trip.setRoute(route);
        trip.setBoat(boat);

        if (tripDto.getDepartureTime() != null && !tripDto.getDepartureTime().isBlank()) {
            trip.setDepartureTime(LocalDateTime.parse(tripDto.getDepartureTime(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        return tripRepository.save(trip);
    }

    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    /**
     * Returns all trips as flat DTOs with a precomputed remainingCapacity field.
     * remainingCapacity = boatCapacity - sum of cargo weight on PENDING/CONFIRMED bookings.
     */
    @Transactional(readOnly = true)
    public List<TripWithCapacityDto> getAllTripsWithCapacity() {
        return tripRepository.findAll().stream()
                .map(trip -> {
                    Route route = trip.getRoute();
                    Boat boat = trip.getBoat();
                    double reserved = bookingRepository.totalReservedCargoWeight(trip.getTripId());
                    double capacity = boat != null && boat.getCapacity() != null ? boat.getCapacity() : 0.0;
                    double remaining = Math.max(0.0, capacity - reserved);
                    return new TripWithCapacityDto(
                            trip.getTripId(),
                            route != null ? route.getRouteId() : null,
                            route != null ? route.getSource() : "",
                            route != null ? route.getDestination() : "",
                            boat != null ? boat.getBoatId() : null,
                            boat != null ? boat.getName() : "",
                            capacity,
                            trip.getDepartureTime(),
                            remaining
                    );
                })
                .toList();
    }

    @Transactional
    public void deleteTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + tripId));
        if (bookingRepository.countByTripTripId(tripId) > 0) {
            throw new IllegalStateException("Trip cannot be deleted because bookings already exist.");
        }
        tripRepository.delete(trip);
    }
}
