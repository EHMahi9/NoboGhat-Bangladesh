package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private BoatRepository boatRepository;

    public Trip createTrip(TripDto tripDto) {
        
        // রুট এবং নৌকা যাচাই করা
        Route route = routeRepository.findById(tripDto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Error: Route not found."));
                
        Boat boat = boatRepository.findById(tripDto.getBoatId())
                .orElseThrow(() -> new RuntimeException("Error: Boat not found."));

        // নতুন ট্রিপ তৈরি করা
        Trip newTrip = new Trip();
        newTrip.setRoute(route);
        newTrip.setBoat(boat);

        return tripRepository.save(newTrip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}