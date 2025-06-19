package com.fithealth.backend.service;

import com.fithealth.backend.dto.Health.HealthCreateDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface HealthService {
    Long createHealth(HealthCreateDto.Create createDto);
    List<HealthCreateDto.Response> findHealth(String userEmail);
    LocalDateTime findHealthDate(String userEmail);
}
