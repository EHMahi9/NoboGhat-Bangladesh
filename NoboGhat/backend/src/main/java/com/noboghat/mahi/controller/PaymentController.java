package com.noboghat.mahi.controller;

import com.noboghat.mahi.model.PaymentTransaction;
import com.noboghat.mahi.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('FARMER', 'TRADER')")
    public ResponseEntity<PaymentTransaction> initiatePayment(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        String gateway = payload.getOrDefault("gateway", "SSLCommerz").toString();

        PaymentTransaction transaction = paymentService.initiatePayment(bookingId, gateway);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, String> payload) {
        // In a real scenario, this would verify the signature of the gateway
        String transactionRef = payload.get("transactionRef");
        String status = payload.get("status");

        paymentService.handleWebhook(transactionRef, status);
        return ResponseEntity.ok("Webhook received.");
    }
}
