package com.fithealth.backend.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import com.fithealth.backend.entity.Trainer;

import java.util.Optional;

@Transactional
@Repository
public class TrainerRepositoryImpl implements TrainerRepository {

}
