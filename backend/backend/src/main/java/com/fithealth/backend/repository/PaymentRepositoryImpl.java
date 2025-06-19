package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Payment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PrePersist;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Repository
public class PaymentRepositoryImpl implements PaymentRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Payment> findOne(Long paymentId) {
        Payment payment = em.find(Payment.class, paymentId);
        return Optional.ofNullable(payment);
    }

    @Override
    public List<Long> findbyTrainerEmail(String trainerEmail) {
        return em.createQuery(
                        "SELECT p.paymentId FROM Payment p WHERE p.responseMember.userEmail = :trainerEmail", Long.class)
                .setParameter("trainerEmail", trainerEmail)
                .getResultList();
    }
}
