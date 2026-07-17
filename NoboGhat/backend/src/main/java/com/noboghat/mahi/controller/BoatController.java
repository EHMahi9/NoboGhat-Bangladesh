package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.BoatCreationDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.service.BoatService;

@RestController
@RequestMapping("/api/boats")
@CrossOrigin(origins = "*")
public class BoatController {
    private final BoatService boatService;

    public BoatController(BoatService boatService) {
        this.boatService = boatService;
    }

    @PostMapping
    public Boat addBoat(@RequestBody BoatCreationDto creationDto) {
        return boatService.createBoat(creationDto);
    }

    @GetMapping
    public List<Boat> getAllBoats() {
        return boatService.getAllBoats();
    }
}
