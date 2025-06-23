package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.PaymentRepository;
import com.fithealth.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements  PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public ResponsePaymentDto.Response findPayment(String userEmail) {
        Payment payment = paymentRepository.findOneLast(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        return ResponsePaymentDto.Response.toDto(payment);
    }

    @Override
    public Long goPayment(ReservationCreateDto.Create createDto) {
        Payment payment = paymentRepository.findOne(createDto.getPayment_id())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        payment.changePayment(CommonEnums.Status.Y);

        Reservation reservation = createDto.toEntity();
        reservation.changePayment(payment);

        reservationRepository.save(reservation);
        return reservation.getReservationNo();
    }
}
