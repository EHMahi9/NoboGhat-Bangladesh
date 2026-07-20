package com.noboghat.mahi.controller;

import com.noboghat.mahi.dto.LoginDto;
import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.security.JwtUtil;
import com.noboghat.mahi.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
        response.put("role", newUser.getRole());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDto loginDto) {
        // 1. Verify the phone and password against the database via AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getPhone(), loginDto.getPassword())
        );

        // 2. If successful, fetch the verified details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Generate the actual JWT
        String jwt = jwtUtil.generateToken(userDetails);

        // 4. Return the token to the frontend
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful.");
        response.put("token", jwt);
        response.put("phone", userDetails.getUsername());
        
        // Extract the user's role to send back to the frontend
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        response.put("role", role);

        return ResponseEntity.ok(response);
    }
}
