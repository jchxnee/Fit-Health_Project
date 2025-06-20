package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements  PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public ResponsePaymentDto.Response findPayment(String userEmail) {
        Payment payment = paymentRepository.findOneLast(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        return ResponsePaymentDto.Response.toDto(payment);
    }

    @Override
    public Boolean goPayment(Long paymentId) {
        Payment payment = paymentRepository.findOne(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        payment.changePayment(CommonEnums.Status.Y);
        return true;
    }
}
