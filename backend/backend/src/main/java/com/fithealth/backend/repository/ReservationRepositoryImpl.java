package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Repository
public class ReservationRepositoryImpl implements ReservationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Reservation reservation) {
        em.persist(reservation);
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
}
