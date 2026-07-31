package com.noboghat.mahi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS is now handled entirely in SecurityConfig via CorsConfigurationSource.
    // Keeping this class as a placeholder for any future web configuration needs.
}
