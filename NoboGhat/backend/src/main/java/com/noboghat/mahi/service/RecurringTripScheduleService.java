package com.noboghat.mahi.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.noboghat.mahi.dto.RecurringTripScheduleDto;
import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.model.RecurringTripSchedule;
import com.noboghat.mahi.model.Route;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.repository.BoatRepository;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.RecurringTripScheduleRepository;
import com.noboghat.mahi.repository.RouteRepository;
import com.noboghat.mahi.repository.TripRepository;

@Service
public class RecurringTripScheduleService {
    private final RecurringTripScheduleRepository schedules;
    private final RouteRepository routes;
    private final BoatRepository boats;
    private final TripRepository trips;
    private final BookingRepository bookings;

    public RecurringTripScheduleService(RecurringTripScheduleRepository schedules, RouteRepository routes,
            BoatRepository boats, TripRepository trips, BookingRepository bookings) {
        this.schedules = schedules;
        this.routes = routes;
        this.boats = boats;
        this.trips = trips;
        this.bookings = bookings;
    }

    @Transactional(readOnly = true)
    public List<RecurringTripSchedule> getAll() {
        return schedules.findAll();
    }

    @Transactional
    public RecurringTripSchedule create(RecurringTripScheduleDto dto) {
        RecurringTripSchedule schedule = new RecurringTripSchedule();
        apply(schedule, dto);
        RecurringTripSchedule saved = schedules.save(schedule);
        generateUpcomingTrips();
        return saved;
    }

    @Transactional
    public RecurringTripSchedule update(Long scheduleId, RecurringTripScheduleDto dto) {
        RecurringTripSchedule schedule = schedules.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Recurring schedule not found."));
        removeFutureUnbookedTrips(scheduleId);
        apply(schedule, dto);
        RecurringTripSchedule saved = schedules.save(schedule);
        generateUpcomingTrips();
        return saved;
    }

    @Transactional
    public void delete(Long scheduleId) {
        RecurringTripSchedule schedule = schedules.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Recurring schedule not found."));
        removeFutureUnbookedTrips(scheduleId);
        schedules.delete(schedule);
    }

    /** Keeps a rolling seven-day set of concrete, bookable trips for each active schedule. */
    @Transactional
    public void generateUpcomingTrips() {
        LocalDate today = LocalDate.now();
        for (RecurringTripSchedule schedule : schedules.findByActiveTrue()) {
            for (int offset = 0; offset < 7; offset++) {
                LocalDate date = today.plusDays(offset);
                if (date.getDayOfWeek() != schedule.getDayOfWeek()) continue;
                LocalDateTime departure = LocalDateTime.of(date, schedule.getDepartureTime());
                if (departure.isBefore(LocalDateTime.now())) continue;
                if (trips.existsByRecurringScheduleScheduleIdAndDepartureTime(schedule.getScheduleId(), departure)) continue;
                Trip trip = new Trip();
                trip.setRoute(schedule.getRoute());
                trip.setBoat(schedule.getBoat());
                trip.setDepartureTime(departure);
                trip.setRecurringSchedule(schedule);
                trips.save(trip);
            }
        }
    }

    private void apply(RecurringTripSchedule schedule, RecurringTripScheduleDto dto) {
        Route route = routes.findById(dto.getRouteId()).orElseThrow(() -> new IllegalArgumentException("Route not found."));
        Boat boat = boats.findById(dto.getBoatId()).orElseThrow(() -> new IllegalArgumentException("Boat not found."));
        try {
            schedule.setDayOfWeek(DayOfWeek.valueOf(dto.getDayOfWeek().trim().toUpperCase()));
            schedule.setDepartureTime(LocalTime.parse(dto.getDepartureTime()));
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException("Choose a valid weekday and departure time.");
        }
        schedule.setRoute(route);
        schedule.setBoat(boat);
        schedule.setActive(true);
    }

    private void removeFutureUnbookedTrips(Long scheduleId) {
        List<Trip> futureTrips = trips.findByRecurringScheduleScheduleIdAndDepartureTimeAfter(scheduleId, LocalDateTime.now());
        for (Trip trip : futureTrips) {
            if (bookings.countByTripTripId(trip.getTripId()) > 0) {
                throw new IllegalStateException("This schedule has future bookings and cannot be changed or deleted.");
            }
        }
        trips.deleteAll(futureTrips);
    }
}
