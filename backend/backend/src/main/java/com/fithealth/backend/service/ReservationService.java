package com.fithealth.backend.service;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationService {
    List<LocalDateTime> findDisableDate(Long trainerNo);
}
