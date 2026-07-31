package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("The request contains invalid data.");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthentication(AuthenticationException exception) {
        return ResponseEntity.status(401).body(Map.of("message", "Phone number or password is incorrect."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateKey(DataIntegrityViolationException exception) {
        String message = exception.getRootCause() != null ? exception.getRootCause().getMessage() : "Duplicate entry detected.";
        if (message.contains("phone")) {
            message = "This phone number is already registered.";
        } else if (message.contains("email")) {
            message = "This email is already registered.";
        }
        return ResponseEntity.status(409).body(Map.of("message", message));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleConflict(IllegalStateException exception) {
        return ResponseEntity.status(409).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException exception) {
        return ResponseEntity.status(403).body(Map.of("message", exception.getMessage()));
    }
}
