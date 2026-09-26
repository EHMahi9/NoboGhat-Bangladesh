package com.noboghat.mahi.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/db-check")
public class DbCheckController {
    private final JdbcTemplate jdbcTemplate;
    public DbCheckController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @GetMapping
    public List<Map<String, Object>> checkDb() {
        return jdbcTemplate.queryForList("DESCRIBE users");
    }
}
