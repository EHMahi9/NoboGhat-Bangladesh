package com.noboghat.mahi.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("FARMER")
public class Farmer extends User {
    // Inherits userId, name, phone, passwordHash[cite: 11, 12]
    public Farmer() { super(); }
}