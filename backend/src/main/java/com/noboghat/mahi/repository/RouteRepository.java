package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
    // Spring Boot স্বয়ংক্রিয়ভাবে save(), findAll(), findById() এর মতো মেথডগুলো তৈরি করে নেবে।
}