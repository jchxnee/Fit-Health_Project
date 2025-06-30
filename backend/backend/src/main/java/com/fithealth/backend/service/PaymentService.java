package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;

import com.fithealth.backend.dto.Refund.RefundCreateDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto.Create;
import com.fithealth.backend.dto.Reservation.UpdateReservationDto;
import com.fithealth.backend.dto.Salary.SalaryCreateDto;
import java.util.List;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.dto.Reservation.SelectReservation;

public interface PaymentService {
    Long insertPayment(CreatePaymentDto.Create createDto);
    ResponsePaymentDto.Response findPayment(Long paymentId);
    Long goPayment(ReservationCreateDto.Create createDto);
    List<SelectPaymentDto.Response> findPaymentList(String userEmail);
    List<SelectPaymentDto.ResponseTrainer> findPaymentListByTrainer(String userEmail);
    List<SelectReservation.RefundResponse> findReservation(Long paymentId);
    Long goRefund(RefundCreateDto.Create createDto);
    Long goSalary(SalaryCreateDto.Create createDto);
    void updateReservationStatus(UpdateReservationDto dto);

    Long insertReservation(Create createDto);
}
