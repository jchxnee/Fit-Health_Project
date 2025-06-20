package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Health;

import java.util.List;

public interface HealthRepository {
    void save(Health health);
    List<Health> findHealth(String userEmail);
    Health findHealthDate(String userEmail);
}
