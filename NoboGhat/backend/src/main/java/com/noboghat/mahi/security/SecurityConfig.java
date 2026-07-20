package com.noboghat.mahi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import com.noboghat.mahi.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter,
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.googleOAuth2SuccessHandler = googleOAuth2SuccessHandler;
    }

    // 1. Password Encoder: Upgrading from simple hash to secure BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Authentication Provider: Tells Spring how to find users and check passwords
    // UserService is injected here as a method parameter, NOT constructor parameter
    // This breaks the circular dependency: SecurityConfig → UserService → PasswordEncoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 3. Authentication Manager: The core engine that processes authentication requests
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 4. Security Filter Chain: Defining the rules for API access
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
            ObjectProvider<ClientRegistrationRepository> clientRegistrations) throws Exception {
        http
            // Disable CSRF because our token-based API is stateless and not vulnerable to it
            .csrf(csrf -> csrf.disable())
            
            // Define endpoint access rules based on your API Design
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll() // Public access
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/trips/**", "/api/routes/**", "/api/boats/**").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Role-based access for Admin Dashboard
                .anyRequest().authenticated() // All other routes (boats, bookings, trips) require a valid JWT
            )
            
            // Tell Spring NOT to create HTTP sessions (we are using JWTs instead)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Register our Authentication Provider
            .authenticationProvider(authenticationProvider())

            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"message\":\"Please sign in to continue.\"}");
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(403);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"message\":\"You do not have permission to access this resource.\"}");
                }))
            
            // Insert our custom JWT filter BEFORE the standard Spring username/password filter
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // The Google flow is enabled only if Google client credentials are supplied.
        if (clientRegistrations.getIfAvailable() != null) {
            http.oauth2Login(oauth -> oauth.successHandler(googleOAuth2SuccessHandler));
        }

        return http.build();
    }
}
