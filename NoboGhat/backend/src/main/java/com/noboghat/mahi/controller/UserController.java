package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        return userService.registerNewUser(registrationDto);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> credentials) {
        // This is a placeholder for Phase 6.
        // It will eventually validate the phone/password and return a JWT Token.
        String phone = credentials.get("phone");
        String password = credentials.get("password");

        return ResponseEntity.ok(Map.of("message", "Login successful for " + phone + ". JWT token will be generated here in Phase 6."));
    }
}
