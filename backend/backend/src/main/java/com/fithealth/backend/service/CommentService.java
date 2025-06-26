package com.fithealth.backend.service;

import com.fithealth.backend.dto.Comment.CommentCreateDto;
import com.fithealth.backend.dto.Comment.CommentGetDto;

import com.fithealth.backend.dto.Comment.MyCommentGetDto;
import java.util.List;

public interface CommentService {
    Long createComment(CommentCreateDto.Create commentCreateDto);

    List<CommentGetDto> getCommentsByBoardNo(Long boardNo);

    void deleteComment(Long commentNo);

    List<MyCommentGetDto> getMyComments(String userEmail);
}
