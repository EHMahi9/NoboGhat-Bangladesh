package com.noboghat.mahi.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/test-error")
public class TestErrorController {
    @GetMapping
    public String throwError() {
        throw new RuntimeException("This is a test error to check ApiExceptionHandler");
    }
}
