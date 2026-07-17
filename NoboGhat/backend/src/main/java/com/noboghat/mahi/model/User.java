package com.noboghat.mahi.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    private String name;
    private String phone;
    private String role; // Farmer, BoatOwner, Admin

    // নতুন যোগ করা অংশ: ইউজারের সাথে নৌকার সম্পর্ক
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnore // এটি API-তে ডাটা দেখানোর সময় অসীম লুপ (Infinite Loop) তৈরি হওয়া থেকে বাঁচাবে
    private List<Boat> boats;
}