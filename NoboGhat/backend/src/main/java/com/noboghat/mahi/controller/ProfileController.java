package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.model.User;
import com.noboghat.mahi.service.UserService;

@RestController
@RequestMapping("/api/users")
public class ProfileController {
    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(Authentication authentication) {
        User user = userService.getUserByIdentifier(authentication.getName());
        return ResponseEntity.ok(Map.of(
            "userId", user.getUserId(),
            "name", user.getName(),
            "phone", user.getPhone() == null ? "" : user.getPhone(),
            "email", user.getEmail() == null ? "" : user.getEmail(),
            "role", user.getRole()
        ));
    }
}
