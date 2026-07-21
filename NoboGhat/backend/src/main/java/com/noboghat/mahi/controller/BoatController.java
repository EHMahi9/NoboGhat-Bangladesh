package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public Boat addBoat(@Valid @RequestBody BoatCreationDto creationDto) {
        return boatService.createBoat(creationDto);
    }

    @GetMapping
    public List<Boat> getAllBoats() {
        return boatService.getAllBoats();
    }

    @PutMapping("/{id}")
    public Boat updateBoat(@PathVariable Long id, @Valid @RequestBody BoatCreationDto creationDto) {
        return boatService.updateBoat(id, creationDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoat(@PathVariable Long id) {
        boatService.deleteBoat(id);
    }
}
