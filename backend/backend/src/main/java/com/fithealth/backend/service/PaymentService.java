package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;

public interface PaymentService {
    Long insertPayment(CreatePaymentDto.Create createDto);
    ResponsePaymentDto.Response findPayment(Long paymentId);
    Long goPayment(ReservationCreateDto.Create createDto);
}
