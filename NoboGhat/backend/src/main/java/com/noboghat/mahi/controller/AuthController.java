package com.noboghat.mahi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.dto.ForgotPasswordDto;
import com.noboghat.mahi.dto.LoginDto;
import com.noboghat.mahi.dto.ResetPasswordDto;
import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.security.JwtUtil;
import com.noboghat.mahi.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        User newUser = userService.registerNewUser(registrationDto);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful.");
        response.put("userId", newUser.getUserId());
        response.put("name", newUser.getName());
        
        // Generate JWT for immediate login if an identifier (phone or email) is available
        String identifier = newUser.getPhone() != null ? newUser.getPhone() : newUser.getEmail();
        if (identifier != null) {
            UserDetails userDetails = userService.loadUserByUsername(identifier);
            String jwt = jwtUtil.generateToken(userDetails);
            response.put("token", jwt);
            response.put("role", roleFrom(userDetails));
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDto loginDto) {
        // 1. Verify the email and password against the database via AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        // 2. If successful, fetch the verified details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Generate the actual JWT
        String jwt = jwtUtil.generateToken(userDetails);

        // 4. Return the token to the frontend
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful.");
        response.put("token", jwt);
        response.put("email", userDetails.getUsername());
        
        // Extract the user's role to send back to the frontend
        // Strip the ROLE_ prefix for frontend compatibility
        response.put("role", roleFrom(userDetails));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {
        String token = userService.generatePasswordResetToken(forgotPasswordDto.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "A recovery token has been generated. In this demo, check the server console for the token.");
        response.put("token", token); // Demo convenience so the flow is testable end-to-end
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        userService.resetPassword(resetPasswordDto.getToken(), resetPasswordDto.getNewPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successful. You can now sign in with your new password.");
        return ResponseEntity.ok(response);
    }

    private String roleFrom(UserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return role != null && role.startsWith("ROLE_") ? role.substring(5) : role;
    }
}
