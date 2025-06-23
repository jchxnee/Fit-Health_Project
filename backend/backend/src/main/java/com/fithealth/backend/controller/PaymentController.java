package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    //결제 생성 API (신청)
    @PostMapping
    public ResponseEntity<Long> insertPayment(@RequestBody CreatePaymentDto.Create createDto) {
        return ResponseEntity.ok(paymentService.insertPayment(createDto));
    }

    //결제 정보 조회 API
    @GetMapping
    public ResponseEntity<ResponsePaymentDto.Response> findPayment(@RequestParam Long paymentId) {
        return ResponseEntity.ok(paymentService.findPayment(paymentId));
    }

    //결제 진행 API
    @PutMapping("/payment")
    public ResponseEntity<Long> goPayment(@RequestBody ReservationCreateDto.Create createDto) {
        return ResponseEntity.ok(paymentService.goPayment(createDto));
    }

    //신청내역 조회
    @GetMapping("/list")
    public ResponseEntity<List<SelectPaymentDto.Response>> selectPaymentList(@RequestParam("userEmail") String userEmail) {
        List<SelectPaymentDto.Response> paymentList = paymentService.findPaymentList(userEmail);
        return ResponseEntity.ok(paymentList);
    }

}
