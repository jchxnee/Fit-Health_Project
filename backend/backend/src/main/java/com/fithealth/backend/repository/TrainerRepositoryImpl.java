package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Trainer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public class TrainerRepositoryImpl implements TrainerRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Long save(Trainer trainer) {
        em.persist(trainer);
        return trainer.getTrainerNo();
    }
}
