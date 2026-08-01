package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.RecurringTripScheduleDto;
import com.noboghat.mahi.model.RecurringTripSchedule;
import com.noboghat.mahi.service.RecurringTripScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/recurring-trips")
public class RecurringTripScheduleController {
    private final RecurringTripScheduleService schedules;

    public RecurringTripScheduleController(RecurringTripScheduleService schedules) {
        this.schedules = schedules;
    }

    @GetMapping
    public List<RecurringTripSchedule> getAll() { return schedules.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecurringTripSchedule create(@Valid @RequestBody RecurringTripScheduleDto dto) { return schedules.create(dto); }

    @PutMapping("/{scheduleId}")
    public RecurringTripSchedule update(@PathVariable Long scheduleId, @Valid @RequestBody RecurringTripScheduleDto dto) {
        return schedules.update(scheduleId, dto);
    }

    @DeleteMapping("/{scheduleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long scheduleId) { schedules.delete(scheduleId); }
}
