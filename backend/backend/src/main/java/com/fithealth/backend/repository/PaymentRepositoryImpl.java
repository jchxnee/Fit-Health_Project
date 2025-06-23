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
        return List.of();
    }

    @Override
    public List<Long> findByResponseEmail(String trainerEmail) {
        return em.createQuery(
                        "SELECT p.paymentId FROM Payment p WHERE p.responseMember.userEmail = :trainerEmail", Long.class)
                .setParameter("trainerEmail", trainerEmail)
                .getResultList();
    }

    @Override
    public List<Payment> findPaymentList(String userEmail) {
        String jpql = "SELECT p FROM Payment p " +
                "JOIN FETCH p.member m " + // 결제자 (사용자) 정보
                "JOIN FETCH p.responseMember rm " + // 응답자 (트레이너) Member 정보
                "LEFT JOIN FETCH rm.trainer t " + // 응답자 Member의 Trainer 정보 (트레이너가 아닐 수도 있으므로 LEFT JOIN)
                "LEFT JOIN FETCH p.reservations r " + // 결제에 포함된 예약 리스트 (completedSessionsCount 계산에 사용)
                "WHERE m.userEmail = :userEmail";

        return em.createQuery(jpql, Payment.class)
                .setParameter("userEmail", userEmail)
                .getResultList();
    }

    @Override
    public Optional<Payment> findOneLast(String userEmail) {
        String sql = "SELECT p FROM Payment p WHERE p.member.userEmail = :userEmail ORDER BY p.appliedAt DESC";
        return em.createQuery(sql, Payment.class)
                .setParameter("userEmail", userEmail)
                .setMaxResults(1)
                .getResultList()
                .stream()
                .findFirst();
    }
}
