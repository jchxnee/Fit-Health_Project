package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;

import java.util.List;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;

public interface PaymentService {
    ResponsePaymentDto.Response findPayment(String userEmail);
    Long goPayment(ReservationCreateDto.Create createDto);
    List<SelectPaymentDto.Response> findPaymentList(String userEmail);
}
