package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Trainer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
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

    @Override
    public List<Trainer> getTop3() {
        return em.createQuery("""
        SELECT t
        FROM Trainer t
        JOIN t.member m
        JOIN Payment p ON p.responseMember = m
        JOIN Review r ON r.payment = p
        WHERE r.status = 'Y'
        GROUP BY t
        ORDER BY COUNT(r) DESC
        """, Trainer.class)
                .setMaxResults(3)
                .getResultList();
    }

}
