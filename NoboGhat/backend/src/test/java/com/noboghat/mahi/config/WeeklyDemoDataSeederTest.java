package com.noboghat.mahi.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

class WeeklyDemoDataSeederTest {

    @Test
    void resolvesMondayForAnyDayInTheSameIsoWeek() {
        assertEquals(LocalDate.of(2026, 8, 17), WeeklyDemoDataSeeder.weekStart(LocalDate.of(2026, 8, 17)));
        assertEquals(LocalDate.of(2026, 8, 17), WeeklyDemoDataSeeder.weekStart(LocalDate.of(2026, 8, 23)));
    }

    @Test
    void advancesToTheNextWeeksMonday() {
        assertEquals(LocalDate.of(2026, 8, 24), WeeklyDemoDataSeeder.weekStart(LocalDate.of(2026, 8, 24)));
    }
}
