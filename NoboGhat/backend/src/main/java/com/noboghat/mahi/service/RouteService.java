package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.repository.RouteRepository;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @CacheEvict(value = "routes", allEntries = true)
    public Route createRoute(Route route) {
        // এখানে খুব সিম্পল লজিক: শুধু ডাটাবেসে সেভ করা
        return routeRepository.save(route);
    }

    public Route createRoute(String source, String destination) {
        return createRoute(source, destination, null);
    }

    @CacheEvict(value = "routes", allEntries = true)
    public Route createRoute(String source, String destination, Double pricePerKg) {
        Route route = new Route();
        route.setSource(source.trim());
        route.setDestination(destination.trim());
        route.setPricePerKg(pricePerKg);
        return routeRepository.save(route);
    }

    @Cacheable("routes")
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}
