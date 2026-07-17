package com.noboghat.mahi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routeId;

    @NotBlank(message = "Route source is required")
    @Column(nullable = false)
    private String source;

    @NotBlank(message = "Route destination is required")
    @Column(nullable = false)
    private String destination;
}
