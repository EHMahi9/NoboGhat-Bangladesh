package com.noboghat.mahi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.model.User;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @GetMapping("/profile")
    public User getUserProfile() {
        // Phase 6 implementation: Fetch the currently authenticated user's profile
        // Requires authentication context
        return null;
    }
}
