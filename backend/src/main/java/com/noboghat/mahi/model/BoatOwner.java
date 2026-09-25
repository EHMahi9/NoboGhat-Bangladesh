package com.noboghat.mahi.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("BOAT_OWNER")
public class BoatOwner extends User {
    public BoatOwner() { super(); }
}
