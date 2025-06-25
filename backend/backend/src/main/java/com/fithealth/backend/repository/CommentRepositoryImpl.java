package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Comment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException; // NoResultException 임포트
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Optional 임포트

@Repository
public class CommentRepositoryImpl implements CommentRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Comment save(Comment comment) {
        if (comment.getCommentNo() == null) { // 새로운 엔티티인 경우 persist
            em.persist(comment);
        } else { // 이미 존재하는 엔티티인 경우 merge (update)
            em.merge(comment);
        }
        return comment;
    }

    @Override
    public Optional<Comment> findById(Long id) {
        try {
            Comment comment = em.find(Comment.class, id);
            return Optional.ofNullable(comment);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public void delete(Comment comment) {
        em.remove(comment);
    }
}