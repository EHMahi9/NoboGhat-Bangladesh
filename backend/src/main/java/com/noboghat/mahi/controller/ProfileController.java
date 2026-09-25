package com.noboghat.mahi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.ProfileUpdateDto;
import com.noboghat.mahi.dto.UpdateRoleDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.security.JwtUtil;
import com.noboghat.mahi.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class ProfileController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ProfileController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(Authentication authentication) {
        User user = userService.getUserByIdentifier(authentication.getName());
        return ResponseEntity.ok(Map.of(
            "userId", user.getUserId(),
            "name", user.getName(),
            "phone", user.getPhone() == null ? "" : user.getPhone(),
            "email", user.getEmail() == null ? "" : user.getEmail(),
            "role", user.getRole(),
            "profilePictureUrl", user.getProfilePictureUrl() == null ? "" : user.getProfilePictureUrl()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(Authentication authentication, @Valid @RequestBody ProfileUpdateDto dto) {
        User user = userService.updateProfile(authentication.getName(), dto.getName(), dto.getPhone(), dto.getCurrentPassword(), dto.getNewPassword(), dto.getProfilePictureUrl());
        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully.",
            "name", user.getName(),
            "phone", user.getPhone() == null ? "" : user.getPhone(),
            "email", user.getEmail() == null ? "" : user.getEmail(),
            "role", user.getRole(),
            "profilePictureUrl", user.getProfilePictureUrl() == null ? "" : user.getProfilePictureUrl()
        ));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Map<String, String>> deactivateProfile(Authentication authentication) {
        userService.deactivateAccount(authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Your account has been deactivated. You can no longer sign in."));
    }

    @PutMapping("/update-role")
    public ResponseEntity<Map<String, Object>> updateRole(Authentication authentication, @Valid @RequestBody UpdateRoleDto dto) {
        User user = userService.getUserByIdentifier(authentication.getName());
        User updatedUser = userService.updateUserRole(user.getUserId(), dto.getRole());
        
        // Generate a new JWT with the updated role
        UserDetails userDetails = userService.loadUserByUsername(
            updatedUser.getPhone() != null ? updatedUser.getPhone() : updatedUser.getEmail()
        );
        String newToken = jwtUtil.generateToken(userDetails);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role updated successfully.");
        response.put("token", newToken);
        response.put("role", updatedUser.getRole());
        response.put("userId", updatedUser.getUserId());
        response.put("name", updatedUser.getName());
        
        return ResponseEntity.ok(response);
    }
}
