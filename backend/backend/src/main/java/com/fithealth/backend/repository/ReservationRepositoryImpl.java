package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Repository
public class ReservationRepositoryImpl implements ReservationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public boolean save(Reservation reservation) {
        em.persist(reservation);
        return true;
    }

    @Override
    public List<Reservation> findByPaymentId(Long paymentId, CommonEnums.Status status) {
        String jpql = "SELECT r FROM Reservation r " +
                "JOIN FETCH r.payment p " +
                "JOIN FETCH p.responseMember rm " +
                "JOIN FETCH p.member m " +
                "WHERE p.paymentId = :paymentId AND r.status = :status ORDER BY r.reservationNo ASC";
        return em.createQuery(jpql, Reservation.class)
                .setParameter("paymentId", paymentId)
                .setParameter("status", status)
                .getResultList();
    }

    @Override
    public Reservation findByReservationNo(Long reservationNo) {
        return em.find(Reservation.class, reservationNo);
    }

    @Override
    public List<LocalDateTime> findDisableDate(Long trainerNo) {
        String jpql = """
    SELECT r.selectDate
    FROM Reservation r
    WHERE r.payment.responseMember IN (
        SELECT t.member FROM Trainer t WHERE t.trainerNo = :trainerNo
    )
    AND r.rejectComment IS NULL
    AND r.selectDate > :now
    """;

        return em.createQuery(jpql, LocalDateTime.class)
                .setParameter("trainerNo", trainerNo)
                .setParameter("now", LocalDateTime.now())
                .getResultList();
    }
}
