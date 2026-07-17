package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.noboghat.mahi.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // এখানে কোনো কোড লেখা লাগবে না, Spring Boot নিজে থেকেই সব মেথড (যেমন save, findAll) তৈরি করে দেবে!
}