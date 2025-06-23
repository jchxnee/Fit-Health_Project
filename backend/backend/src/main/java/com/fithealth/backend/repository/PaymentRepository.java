package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository {
    void save(Payment payment);
    Optional<Payment> findOne(Long paymentId);
    List<Long> findbyTrainerEmail(String trainerEmail);
    Optional<Payment> findOneLast(String userEmail);
    List<Long> findByResponseEmail(String trainerEmail);
}
