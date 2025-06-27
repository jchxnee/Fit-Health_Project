package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.enums.CommonEnums;
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
    public List<Trainer> getTop3(CommonEnums.Status status) {
        String query = "SELECT t FROM Trainer t " +
                "JOIN t.member m " +
                "JOIN Payment p ON p.responseMember = m " +
                "JOIN Review r ON r.payment = p " +
                "WHERE r.status = :status " +
                "GROUP BY t " +
                "ORDER BY COUNT(r) DESC";

        return em.createQuery(query, Trainer.class)
                .setParameter("status", status)
                .setMaxResults(3)
                .getResultList();
    }

}
