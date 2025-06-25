package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Comment;

import java.util.Optional; // Optional 임포트

public interface CommentRepository {
    Comment save(Comment comment);
    Optional<Comment> findById(Long id); // Optional로 변경
    void delete(Comment comment); // delete 메서드 추가
}