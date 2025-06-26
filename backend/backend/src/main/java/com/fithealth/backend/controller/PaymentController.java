package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;
import com.fithealth.backend.dto.Refund.RefundCreateDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.dto.Reservation.SelectReservation;
import com.fithealth.backend.dto.Salary.SalaryCreateDto;
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
        System.out.println(userEmail);
        List<SelectPaymentDto.Response> paymentList = paymentService.findPaymentList(userEmail);
        return ResponseEntity.ok(paymentList);
    }

    //코칭내역 조회
    @GetMapping("/trainerlist")
    public ResponseEntity<List<SelectPaymentDto.ResponseTrainer>> selectPaymentListTrainer(@RequestParam("userEmail") String userEmail) {
        return ResponseEntity.ok(paymentService.findPaymentListByTrainer(userEmail));
    }

    //진행된 레슨 회차 정보 조회 API
    @GetMapping("/reservation")
    public ResponseEntity<List<SelectReservation.RefundResponse>> findReservation(@RequestParam Long paymentId) {
        return ResponseEntity.ok(paymentService.findReservation(paymentId));
    }

    //환불 진행 API
    @PutMapping("/refund")
    public ResponseEntity<Long> goRefund(@RequestBody RefundCreateDto.Create createDto) {
        return ResponseEntity.ok(paymentService.goRefund(createDto));
    }

    //정산 신청 진행 API
    @PutMapping("/salary")
    public ResponseEntity<Long> goSalary(@RequestBody SalaryCreateDto.Create createDto) {
        return ResponseEntity.ok(paymentService.goSalary(createDto));
    }

}
