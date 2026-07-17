package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.TripDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.RouteRepository;
import com.noboghat.mahi.repository.TripRepository;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BoatRepository boatRepository;

    public TripService(TripRepository tripRepository, RouteRepository routeRepository, BoatRepository boatRepository) {
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.boatRepository = boatRepository;
    }

    public Trip createTrip(TripDto tripDto) {
        Route route = routeRepository.findById(tripDto.getRouteId())
                .orElseThrow(() -> new IllegalArgumentException("Route not found."));
        Boat boat = boatRepository.findById(tripDto.getBoatId())
                .orElseThrow(() -> new IllegalArgumentException("Boat not found."));

        Trip trip = new Trip();
        trip.setRoute(route);
        trip.setBoat(boat);
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}
