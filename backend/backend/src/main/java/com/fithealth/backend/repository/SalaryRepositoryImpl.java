package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Salary;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public class SalaryRepositoryImpl implements SalaryRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Salary salary) {
        em.persist(salary);
    }
}
