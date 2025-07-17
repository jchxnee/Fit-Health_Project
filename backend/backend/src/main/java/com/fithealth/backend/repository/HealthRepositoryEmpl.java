package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Health;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Transactional
@Repository
public class HealthRepositoryEmpl implements HealthRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Health health) {
        em.persist(health);
    }

    @Override
    public List<Health> findHealth(String userEmail) {
        return em.createQuery(
                        "SELECT h FROM Health h WHERE h.member.userEmail = :userEmail ORDER BY h.createDate DESC", Health.class)
                .setParameter("userEmail", userEmail)
                .setMaxResults(10)
                .getResultList();
    }

    @Override
    public Health findHealthDate(String userEmail) {
        return em.createQuery(
                        "SELECT h FROM Health h WHERE h.member.userEmail = :userEmail ORDER BY h.createDate DESC", Health.class)
                .setParameter("userEmail", userEmail)
                .setMaxResults(1)
                .getSingleResult();

    }
}
