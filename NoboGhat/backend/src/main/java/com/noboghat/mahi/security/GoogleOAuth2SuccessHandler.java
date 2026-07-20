package com.noboghat.mahi.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.noboghat.mahi.model.User;
import com.noboghat.mahi.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Converts a successful Google identity verification into NoboGhat's JWT. */
@Component
public class GoogleOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final String frontendUrl;

    public GoogleOAuth2SuccessHandler(UserService userService, JwtUtil jwtUtil,
            @Value("${app.frontend-url}") String frontendUrl) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            org.springframework.security.core.Authentication authentication) throws IOException, ServletException {
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        String email = googleUser.getAttribute("email");
        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Google did not provide an email address.");
            return;
        }
        User user = userService.registerGoogleUser(email, googleUser.getAttribute("name"));
        UserDetails details = userService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(details);
        String location = frontendUrl + "/pages/dashboard.html?token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&role=" + URLEncoder.encode(user.getRole(), StandardCharsets.UTF_8);
        getRedirectStrategy().sendRedirect(request, response, location);
    }
}
