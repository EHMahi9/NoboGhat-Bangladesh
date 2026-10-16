package com.noboghat.mahi.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    public static final String DEFAULT_DEV_SECRET = "NoboGhat-Default-Local-Dev-Secret-Key-Please-Change-In-Production!";

    private final Key secretKey;
    private final long tokenValidity;
    private final long refreshTokenValidity;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiration-ms}") long tokenValidity,
                   @Value("${app.jwt.refresh-expiration-ms}") long refreshTokenValidity) {
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 characters.");
        }

        boolean isProduction = System.getenv("RENDER") != null 
                || "prod".equalsIgnoreCase(System.getenv("SPRING_PROFILES_ACTIVE"))
                || "production".equalsIgnoreCase(System.getenv("SPRING_PROFILES_ACTIVE"));

        if (DEFAULT_DEV_SECRET.equals(secret)) {
            if (isProduction) {
                throw new IllegalStateException("Cannot use default development JWT_SECRET in production! Please configure the JWT_SECRET environment variable.");
            }
            logger.warn("SECURITY WARNING: Using default local development JWT_SECRET. Do NOT use this secret in production!");
        }

        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.tokenValidity = tokenValidity;
        this.refreshTokenValidity = refreshTokenValidity;
    }

    // 1. Extract the username (email in our case) from the token
    public String extractUsername(String token) {
        return extractClaim(token, claims -> claims.getSubject());
    }

    // 2. Extract expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, claims -> claims.getExpiration());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractTokenType(String token) {
        try {
            return extractClaim(token, claims -> claims.get("token_type", String.class));
        } catch (Exception e) {
            return null;
        }
    }

    // 3. Generate a token for a user
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("token_type", "ACCESS");
        return createToken(claims, userDetails.getUsername(), tokenValidity);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("token_type", "REFRESH");
        return createToken(claims, userDetails.getUsername(), refreshTokenValidity);
    }

    private String createToken(Map<String, Object> claims, String subject, long validity) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(claims)
                .subject(subject) // The subject is the user's phone
                .issuedAt(new Date(now))
                .expiration(new Date(now + validity))
                .signWith(secretKey)
                .compact();
    }

    // 4. Validate the token against the user attempting to access the system
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}