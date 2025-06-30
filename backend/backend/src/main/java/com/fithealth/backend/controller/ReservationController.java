package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Reservation.SelectReservation;
import com.fithealth.backend.dto.Reservation.SelectReservation.RefundResponse;
import com.fithealth.backend.service.ReservationService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    //예약 불가능한 날짜 정보 조회 API
    @GetMapping("/disabledate/{trainerNo}")
    public ResponseEntity<List<LocalDateTime>> findDisableDate(@PathVariable Long trainerNo) {
        return ResponseEntity.ok(reservationService.findDisableDate(trainerNo));
    }
}
