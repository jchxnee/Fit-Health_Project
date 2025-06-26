// src/main/java/com/fithealth/backend/repository/CommentRepository.java
package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Comment;
import java.util.List; // List 임포트 추가
import java.util.Optional;

public interface CommentRepository {
    Comment save(Comment comment);
    Optional<Comment> findById(Long id);
    void delete(Comment comment);

    // 새롭게 추가할 메서드
    List<Comment> findByMemberUserEmail(String userEmail);
}