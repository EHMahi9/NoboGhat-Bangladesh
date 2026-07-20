package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.repository.RouteRepository;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route createRoute(Route route) {
        // এখানে খুব সিম্পল লজিক: শুধু ডাটাবেসে সেভ করা
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}