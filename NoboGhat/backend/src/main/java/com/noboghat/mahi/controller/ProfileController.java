package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.ProfileUpdateDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.service.UserService;

import jakarta.validation.Valid;

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

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(Authentication authentication, @Valid @RequestBody ProfileUpdateDto dto) {
        User user = userService.updateProfile(authentication.getName(), dto.getName(), dto.getPhone(), dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully.",
            "name", user.getName(),
            "phone", user.getPhone() == null ? "" : user.getPhone(),
            "email", user.getEmail() == null ? "" : user.getEmail(),
            "role", user.getRole()
        ));
    }
}
