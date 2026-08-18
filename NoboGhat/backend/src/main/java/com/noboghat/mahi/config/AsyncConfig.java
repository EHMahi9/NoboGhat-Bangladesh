package com.noboghat.mahi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5); // Minimum active threads
        executor.setMaxPoolSize(20); // Maximum active threads
        executor.setQueueCapacity(500); // Queue capacity for pending tasks
        executor.setThreadNamePrefix("NoboAsync-");
        executor.initialize();
        return executor;
    }
}
