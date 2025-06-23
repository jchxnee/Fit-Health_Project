package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Reservation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public class ReservationRepositoryImpl implements ReservationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Reservation reservation) {
        em.persist(reservation);
    }
}
