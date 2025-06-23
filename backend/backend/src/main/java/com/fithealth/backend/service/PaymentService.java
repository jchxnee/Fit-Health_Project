package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;

import java.util.List;

public interface PaymentService {
    ResponsePaymentDto.Response findPayment(String userEmail);
    Boolean goPayment(Long paymentId);
    List<SelectPaymentDto.Response> findPaymentList(String userEmail);
}
