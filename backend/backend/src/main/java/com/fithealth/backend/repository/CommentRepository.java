package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Comment;

public interface CommentRepository {
    Comment save(Comment comment);
}
