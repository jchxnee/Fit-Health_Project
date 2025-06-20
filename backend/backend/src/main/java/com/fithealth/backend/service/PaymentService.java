package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;

public interface PaymentService {
    ResponsePaymentDto.Response findPayment(String userEmail);
    Boolean goPayment(Long paymentId);
}
