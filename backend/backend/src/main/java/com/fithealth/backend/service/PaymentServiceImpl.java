package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.PaymentRepository;
import com.fithealth.backend.repository.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements  PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public Long insertPayment(CreatePaymentDto.Create createDto) {
        Member member = memberRepository.findOne(createDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Member responseMember = memberRepository.findOne(createDto.getTrainer_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Payment payment = createDto.toEntity();
        payment.changeMember(member);
        payment.changeResponseMember(responseMember);

        paymentRepository.save(payment);
        return payment.getPaymentId();
    }

    @Override
    public ResponsePaymentDto.Response findPayment(Long paymentId) {
        Payment payment = paymentRepository.findOne(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        return ResponsePaymentDto.Response.toDto(payment);
    }

    @Override
    public Long goPayment(ReservationCreateDto.Create createDto) {
        System.out.println("조회할 결제 ID: " + createDto.getPayment_id());
        Payment payment = paymentRepository.findOne(createDto.getPayment_id())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        payment.changePayment(CommonEnums.Status.Y);

        Reservation reservation = createDto.toEntity();
        reservation.changePayment(payment);

        reservationRepository.save(reservation);
        return reservation.getReservationNo();
    }

    @Override
    public List<SelectPaymentDto.Response> findPaymentList(String userEmail) {
        List<Payment> payments = paymentRepository.findPaymentList(userEmail);
        return payments.stream()
                .map(SelectPaymentDto.Response::fromEntity)
                .collect(Collectors.toList());
    }
}
