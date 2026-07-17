package com.noboghat.mahi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.service.BookingService;

@RestController
@RequestMapping("/api/bookings") // ব্লুপ্রিন্ট অনুযায়ী সঠিক এন্ডপয়েন্ট
@CrossOrigin(origins = "*")
public class BookingController {

    // Controller সরাসরি ডাটাবেসের সাথে কথা বলবে না, সে শুধুমাত্র Service কে ডাকবে
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createNewBooking(@RequestBody BookingDto bookingDto) {
        try {
            // ফ্রন্টএন্ড থেকে আসা ডাটা (DTO) Service-এ পাঠানো হচ্ছে
            Booking savedBooking = bookingService.createBooking(bookingDto);
            
            // সবকিছু ঠিক থাকলে 200 OK রেসপন্সের সাথে ডাটা ফ্রন্টএন্ডে পাঠিয়ে দিবে
            return ResponseEntity.ok(savedBooking); 
        } catch (RuntimeException e) {
            // ক্যাপাসিটি ওভারলোড বা অন্য কোনো এরর হলে 400 Bad Request রেসপন্স পাঠাবে
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}