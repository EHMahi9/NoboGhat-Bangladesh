package com.noboghat.mahi.service;

import com.noboghat.mahi.model.Booking;
import com.noboghat.mahi.model.PaymentTransaction;
import com.noboghat.mahi.repository.BookingRepository;
import com.noboghat.mahi.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public PaymentService(PaymentTransactionRepository paymentTransactionRepository, BookingRepository bookingRepository, NotificationService notificationService) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PaymentTransaction initiatePayment(Long bookingId, String gateway) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));

        if (booking.getTotalFare() == null || booking.getTotalFare() <= 0) {
            throw new IllegalStateException("Booking has no fare to pay.");
        }

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setBooking(booking);
        transaction.setAmount(booking.getTotalFare());
        transaction.setGateway(gateway);
        transaction.setStatus("PENDING");
        // Mock a gateway transaction reference
        transaction.setTransactionRef(gateway.toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8));

        return paymentTransactionRepository.save(transaction);
    }

    @Transactional
    public PaymentTransaction handleWebhook(String transactionRef, String status) {
        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionRef(transactionRef)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found."));

        transaction.setStatus(status.toUpperCase());
        paymentTransactionRepository.save(transaction);

        if ("SUCCESS".equalsIgnoreCase(status)) {
            // Confirm booking automatically on successful payment
            Booking booking = transaction.getBooking();
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);

            String identifier = booking.getUser().getEmail() != null ? booking.getUser().getEmail() : booking.getUser().getPhone();
            notificationService.createForUser(identifier,
                    "Payment successful! Your booking #" + booking.getBookingId() + " has been confirmed.");
        }

        return transaction;
    }
}
