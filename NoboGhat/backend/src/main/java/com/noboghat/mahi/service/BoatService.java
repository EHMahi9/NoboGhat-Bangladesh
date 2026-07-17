package com.noboghat.mahi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.BoatCreationDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class BoatService {
    private final BoatRepository boatRepository;
    private final UserRepository userRepository;

    public BoatService(BoatRepository boatRepository, UserRepository userRepository) {
        this.boatRepository = boatRepository;
        this.userRepository = userRepository;
    }

    public Boat createBoat(BoatCreationDto creationDto) {
        Boat newBoat = new Boat();
        newBoat.setName(creationDto.getName());
        newBoat.setCapacity(creationDto.getCapacity());

        if (creationDto.getOwnerId() != null) {
            User owner = userRepository.findById(creationDto.getOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("Boat owner not found"));
            newBoat.setOwner(owner);
        }

        return boatRepository.save(newBoat);
    }

    public List<Boat> getAllBoats() {
        return boatRepository.findAll();
    }
}
