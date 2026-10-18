package com.noboghat.mahi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MockEmailService implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        logger.info("==========================================");
        logger.info("MOCK EMAIL SENT TO: {}", to);
        logger.info("SUBJECT: Password Reset Request");
        String maskedToken = (token != null && token.length() > 3)
                ? token.substring(0, 2) + "****" + token.substring(token.length() - 1)
                : "****";
        logger.info("BODY: Password recovery token generated [masked: {}]. Delivery simulated.", maskedToken);
        if (logger.isDebugEnabled()) {
            logger.debug("DEBUG ONLY: Raw recovery token is: {}", token);
        }
        logger.info("Token expires in 15 minutes.");
        logger.info("==========================================");
    }

    @Override
    public void sendWelcomeEmail(String to, String name) {
        logger.info("==========================================");
        logger.info("MOCK EMAIL SENT TO: {}", to);
        logger.info("SUBJECT: Welcome to NoboGhat!");
        logger.info("BODY: Hi {}, welcome to the premier logistics platform.", name);
        logger.info("==========================================");
    }
}
