package com.noboghat.mahi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "boats")
public class Boat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boatId;
    
    private String name;
    private Double capacity;

    // নতুন যোগ করা অংশ: নৌকার মালিক (User) এর সাথে সম্পর্ক
    @ManyToOne
    @JoinColumn(name = "owner_id") // এটি ডাটাবেসে owner_id নামে কলাম তৈরি করবে
    private User owner;
}