package com.noboghat.mahi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.BookingDto;
import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.Trip;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.TripRepository;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Booking createBooking(BookingDto bookingDto) {
        
        // ধাপ ১: ইউজার এবং ট্রিপ ডাটাবেসে বিদ্যমান (existing) আছে কিনা তা খুঁজে বের করা
        User user = userRepository.findById(bookingDto.getUserId())
                .orElseThrow(() -> new RuntimeException("Error: User not found in database."));
                
        Trip trip = tripRepository.findById(bookingDto.getTripId())
                .orElseThrow(() -> new RuntimeException("Error: Trip not found in database."));

        // ধাপ ২: Capacity Validation লজিক (FR-06)
        Double requestedWeight = bookingDto.getCargoWeight();
        Double totalBoatCapacity = trip.getBoat().getCapacity();

        if (requestedWeight > totalBoatCapacity) {
            // যদি কার্গোর ওজন নৌকার ধারণক্ষমতার চেয়ে বেশি হয়, তাহলে আমরা বুকিং বাতিল করে একটি এরর থ্রো করব
            throw new RuntimeException("Capacity Error: Requested weight exceeds total boat capacity.");
        }

        // ধাপ ৩: নতুন বুকিং অবজেক্ট তৈরি করা এবং ডাটা সেট করা
        Booking newBooking = new Booking();
        newBooking.setCargoWeight(requestedWeight);
        newBooking.setStatus("PENDING"); // ডিফল্ট স্ট্যাটাস 
        newBooking.setUser(user);
        newBooking.setTrip(trip);

        // ধাপ ৪: সবকিছু ঠিক থাকলে ডাটাবেসে সেভ করা
        return bookingRepository.save(newBooking);
    }
}