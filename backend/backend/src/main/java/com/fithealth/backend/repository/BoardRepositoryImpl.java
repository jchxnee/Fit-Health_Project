//package com.fithealth.backend.repository;
//
//import com.fithealth.backend.entity.Board;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Repository;
//
//public class BoardRepositoryImpl {
//
//    @PersistenceContext
//    private EntityManager em;
//
//    @Override
//    public Long save(Board board) {
//        em.persist(board);
//        return board.getBoardNo();
//    }
//
//    @Override
//    public Page<Board> findAll(Specification<Board> spec, Pageable pageable) {
//        return null;
//    }
//}
