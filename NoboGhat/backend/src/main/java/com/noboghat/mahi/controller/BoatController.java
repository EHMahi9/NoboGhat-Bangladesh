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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.BoatCreationDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.service.BoatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/boats")
public class BoatController {
    private final BoatService boatService;

    public BoatController(BoatService boatService) {
        this.boatService = boatService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_BOAT_OWNER')")
    public Boat addBoat(@Valid @RequestBody BoatCreationDto creationDto, Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_BOAT_OWNER".equals(role)) {
            throw new AccessDeniedException("Only Boat Owners or Administrators can add boats.");
        }
        // For non-admin users, force ownership to the current user (prevents IDOR)
        if (!"ROLE_ADMIN".equals(role)) {
            creationDto.setOwnerId(null);
        }
        return boatService.createBoat(creationDto, authentication.getName());
    }

    @GetMapping
    public List<Boat> getAllBoats() {
        return boatService.getAllBoats();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_BOAT_OWNER')")
    public Boat updateBoat(@PathVariable Long id, @Valid @RequestBody BoatCreationDto creationDto, Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_BOAT_OWNER".equals(role)) {
            throw new AccessDeniedException("Only Boat Owners or Administrators can update boats.");
        }
        if (!"ROLE_ADMIN".equals(role)) {
            creationDto.setOwnerId(null);
        }
        return boatService.updateBoat(id, creationDto, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_BOAT_OWNER')")
    public void deleteBoat(@PathVariable Long id, Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_BOAT_OWNER".equals(role)) {
            throw new AccessDeniedException("Only Boat Owners or Administrators can delete boats.");
        }
        boatService.deleteBoat(id, authentication.getName());
    }
}
