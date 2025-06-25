// src/main/java/com/fithealth/backend/repository/CommentRepositoryImpl.java
package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Comment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List; // List 임포트 추가
import java.util.Optional;

@Repository
public class CommentRepositoryImpl implements CommentRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Comment save(Comment comment) {
        if (comment.getCommentNo() == null) {
            em.persist(comment);
        } else {
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

    @Override
    public List<Comment> findByMemberUserEmail(String userEmail) {
        // JPQL을 사용하여 userEmail에 해당하는 회원의 댓글을 조회합니다.
        // Comment 엔티티의 'member' 필드를 통해 'Member' 엔티티에 접근하고,
        // 'Member' 엔티티의 'userEmail' 필드를 사용합니다.
        // FETCH JOIN을 사용하여 member와 board 엔티티를 함께 가져와 N+1 문제를 방지합니다.
        return em.createQuery(
                        "SELECT c FROM Comment c JOIN FETCH c.member m JOIN FETCH c.board b WHERE m.userEmail = :userEmail", Comment.class)
                .setParameter("userEmail", userEmail)
                .getResultList();
    }
}