package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import com.noboghat.mahi.dto.TripDto;
import com.noboghat.mahi.dto.TripWithCapacityDto;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.service.TripService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_BOAT_OWNER')")
    public Trip addTrip(@Valid @RequestBody TripDto tripDto, Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_BOAT_OWNER".equals(role)) {
            throw new AccessDeniedException("Only Boat Owners or Administrators can create trips.");
        }
        return tripService.createTrip(tripDto, authentication.getName(), "ROLE_ADMIN".equals(role));
    }

    @GetMapping
    public List<TripWithCapacityDto> getAllTrips(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String source,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String destination,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String date,
            Authentication authentication) {
        java.time.LocalDate parsedDate = null;
        if (date != null && !date.isBlank()) {
            try { parsedDate = java.time.LocalDate.parse(date); } catch (Exception ignored) {}
        }
        boolean hasFilter = (source != null && !source.isBlank())
                || (destination != null && !destination.isBlank())
                || parsedDate != null;
        if (hasFilter) {
            return tripService.searchTripsWithCapacity(source, destination, parsedDate);
        }
        
        String role = authentication != null && authentication.getAuthorities().iterator().hasNext() ? 
            authentication.getAuthorities().iterator().next().getAuthority() : null;
        if ("ROLE_BOAT_OWNER".equals(role)) {
            return tripService.getTripsWithCapacityByOwner(authentication.getName());
        }
        return tripService.getAllTripsWithCapacity();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_BOAT_OWNER')")
    public void deleteTrip(@PathVariable Long id, Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_BOAT_OWNER".equals(role)) {
            throw new AccessDeniedException("Only Boat Owners or Administrators can delete trips.");
        }
        tripService.deleteTrip(id, authentication.getName(), "ROLE_ADMIN".equals(role));
    }
}
