package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.dto.BookingStatusUpdateDto;
import com.noboghat.mahi.dto.BookingSummaryDto;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createNewBooking(@Valid @RequestBody BookingDto bookingDto, Authentication authentication) {
        return bookingService.createBooking(bookingDto, authentication.getName());
    }

    @GetMapping
    public List<BookingSummaryDto> getMyBookings(Authentication authentication) {
        return bookingService.getBookingsForUser(authentication.getName());
    }
    
    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Long id, Authentication authentication) {
        return bookingService.getBookingById(id, authentication.getName(), isAdmin(authentication));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelBooking(@PathVariable Long id, Authentication authentication) {
        bookingService.cancelBooking(id, authentication.getName(), isAdmin(authentication));
    }

    @PatchMapping("/admin/{id}/status")
    public BookingSummaryDto updateBookingStatus(@PathVariable Long id, @Valid @RequestBody BookingStatusUpdateDto statusUpdateDto, Authentication authentication) {
        return bookingService.updateBookingStatus(id, statusUpdateDto, authentication.getName(), isAdmin(authentication));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
    }
}
