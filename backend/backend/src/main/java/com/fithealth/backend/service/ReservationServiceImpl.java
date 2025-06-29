package com.fithealth.backend.service;

import com.fithealth.backend.repository.ReservationRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;

    @Override
    public List<LocalDateTime> findDisableDate(Long trainerNo) {
        return reservationRepository.findDisableDate(trainerNo);
    }
}
