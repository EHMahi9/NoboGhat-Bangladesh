package com.noboghat.mahi.controller;

import com.noboghat.mahi.model.PaymentTransaction;
import com.noboghat.mahi.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    @PreAuthorize("hasAnyRole('FARMER', 'TRADER', 'ADMIN')")
    public ResponseEntity<PaymentTransaction> initiatePayment(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        String gateway = payload.getOrDefault("gateway", "SSLCommerz").toString();

        PaymentTransaction transaction = paymentService.initiatePayment(bookingId, gateway);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/webhook")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload, Authentication authentication) {
        // In a real scenario, this would verify the signature of the gateway
        String transactionRef = payload.get("transactionRef") != null ? payload.get("transactionRef").toString() : null;
        String status = payload.get("status") != null ? payload.get("status").toString() : null;

        paymentService.handleWebhook(transactionRef, status, authentication != null ? authentication.getName() : null, isAdmin(authentication));
        return ResponseEntity.ok("Webhook received.");
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
