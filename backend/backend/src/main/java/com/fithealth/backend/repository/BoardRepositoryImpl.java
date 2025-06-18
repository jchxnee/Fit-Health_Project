package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class BoardRepositoryImpl implements BoardRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Long save(Board board) {
        em.persist(board);
        return board.getBoardNo();
    }
}
