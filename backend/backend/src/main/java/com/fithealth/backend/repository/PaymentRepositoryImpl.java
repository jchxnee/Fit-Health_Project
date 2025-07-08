package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
    public void save(Payment payment) {
        em.persist(payment);
    }

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
                "JOIN FETCH p.member m " +
                "JOIN FETCH p.responseMember rm " +
                "LEFT JOIN FETCH rm.trainer t " +
                "LEFT JOIN FETCH p.reservations r " +
                "LEFT JOIN FETCH p.review rv " +
                "WHERE m.userEmail = :userEmail " +
                "AND p.paymentStatus = :statusY"; // ✨ 이 조건 추가

        return em.createQuery(jpql, Payment.class)
                .setParameter("userEmail", userEmail)
                .setParameter("statusY", CommonEnums.Status.Y) // ✨ 파라미터 추가
                .getResultList();
    }

    @Override
    public List<Payment> findPaymentListTrainer(String userEmail) {
        // ✨ 이 부분에 paymentStatus = :statusY 조건과 파라미터를 추가했습니다.
        return em.createQuery(
                        "SELECT p FROM Payment p WHERE p.responseMember.userEmail = :trainerEmail " +
                                "AND p.paymentStatus = :statusY", Payment.class)
                .setParameter("trainerEmail", userEmail)
                .setParameter("statusY", CommonEnums.Status.Y) // ✨ 파라미터 추가
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
