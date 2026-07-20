package com.noboghat.mahi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.noboghat.mahi.model.Boat;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    // এখানেও আমাদের নতুন কোনো কোড লিখতে হবে না, সব মেথড রেডি!
}