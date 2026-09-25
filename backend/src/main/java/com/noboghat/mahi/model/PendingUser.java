package com.noboghat.mahi.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PENDING")
public class PendingUser extends User {
    public PendingUser() { super(); }
}