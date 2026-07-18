package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Kept as a placeholder router. Actual auth endpoints moved to AuthController.
 * This prevents mapping conflicts while preserving the file.
 */
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> authStatus() {
        return ResponseEntity.ok(Map.of("status", "Auth endpoints handled by AuthController"));
    }
}
