package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.BoatCreationDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.TripRepository;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class BoatService {
    private final BoatRepository boatRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    public BoatService(BoatRepository boatRepository, UserRepository userRepository, TripRepository tripRepository) {
        this.boatRepository = boatRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional
    public Boat createBoat(BoatCreationDto creationDto, String currentUserIdentifier) {
        Boat newBoat = new Boat();
        newBoat.setName(creationDto.getName());
        newBoat.setCapacity(creationDto.getCapacity());

        if (creationDto.getOwnerId() != null) {
            // Admin is assigning a specific owner
            User owner = userRepository.findById(creationDto.getOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("Boat owner not found"));
            newBoat.setOwner(owner);
        } else {
            // Assign to the current authenticated user
            User currentUser = userRepository.findByPhone(currentUserIdentifier)
                    .or(() -> userRepository.findByEmail(currentUserIdentifier))
                    .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
            newBoat.setOwner(currentUser);
        }

        return boatRepository.save(newBoat);
    }

    @Transactional(readOnly = true)
    public List<Boat> getAllBoats() {
        return boatRepository.findAll();
    }

    @Transactional
    public Boat updateBoat(Long boatId, BoatCreationDto creationDto, String currentUserIdentifier) {
        Boat boat = boatRepository.findById(boatId)
                .orElseThrow(() -> new IllegalArgumentException("Boat not found."));
        
        // Verify ownership unless admin
        User currentUser = userRepository.findByPhone(currentUserIdentifier)
                .or(() -> userRepository.findByEmail(currentUserIdentifier))
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        String role = currentUser.getRole();
        if (!"ADMIN".equals(role) && !boat.getOwner().getUserId().equals(currentUser.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only update your own boats.");
        }
        
        boat.setName(creationDto.getName());
        boat.setCapacity(creationDto.getCapacity());
        if (creationDto.getOwnerId() != null && "ADMIN".equals(role)) {
            User owner = userRepository.findById(creationDto.getOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("Boat owner not found"));
            boat.setOwner(owner);
        }
        return boatRepository.save(boat);
    }

    @Transactional
    public void deleteBoat(Long boatId, String currentUserIdentifier) {
        Boat boat = boatRepository.findById(boatId)
                .orElseThrow(() -> new IllegalArgumentException("Boat not found."));
        
        // Verify ownership unless admin
        User currentUser = userRepository.findByPhone(currentUserIdentifier)
                .or(() -> userRepository.findByEmail(currentUserIdentifier))
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        String role = currentUser.getRole();
        if (!"ADMIN".equals(role) && !boat.getOwner().getUserId().equals(currentUser.getUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only delete your own boats.");
        }
        
        // Check for trip references before deletion
        if (tripRepository.countByBoatBoatId(boatId) > 0) {
            throw new IllegalStateException("Boat cannot be deleted because trips exist for it.");
        }
        
        boatRepository.delete(boat);
    }
}
