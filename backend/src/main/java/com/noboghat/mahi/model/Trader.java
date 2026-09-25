package com.noboghat.mahi.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TRADER")
public class Trader extends User {
    public Trader() { super(); }
}
