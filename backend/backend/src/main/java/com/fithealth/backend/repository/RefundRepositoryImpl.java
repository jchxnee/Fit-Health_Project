package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Refund;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public class RefundRepositoryImpl implements  RefundRepository{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Refund refund) {
        em.persist(refund);
    }
}
