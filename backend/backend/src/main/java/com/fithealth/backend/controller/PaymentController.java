package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    //결제 정보 조회 API
    @GetMapping
    public ResponseEntity<ResponsePaymentDto.Response> findPayment(@RequestParam String userEmail) {
        return ResponseEntity.ok(paymentService.findPayment(userEmail));
    }

    //결제 진행 API
    @PutMapping("/payment")
    public ResponseEntity<Long> goPayment(@RequestBody ReservationCreateDto.Create createDto) {
        return ResponseEntity.ok(paymentService.goPayment(createDto));
    }
}
