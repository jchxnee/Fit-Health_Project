// src/main/java/com/fithealth/backend/service/CommentServiceImpl.java
package com.fithealth.backend.service;

import com.fithealth.backend.dto.Comment.CommentCreateDto;
import com.fithealth.backend.dto.Comment.CommentGetDto;
import com.fithealth.backend.dto.Comment.MyCommentGetDto;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.Comment;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.BoardRepository;
import com.fithealth.backend.repository.CommentRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Override
    public Long createComment(CommentCreateDto.Create commentCreateDto) {
        Member member = memberRepository.findOne(commentCreateDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Board board = boardRepository.findById(commentCreateDto.getBoard_no())
                .orElseThrow(() -> new EntityNotFoundException("게시물을 찾을 수 없습니다."));

        Comment comment = commentCreateDto.toEntity();
        comment.changeMember(member);
        comment.changeBoard(board);

        Comment savedComment = commentRepository.save(comment);
        return savedComment.getCommentNo();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentGetDto> getCommentsByBoardNo(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시물을 찾을 수 없습니다."));

        return board.getComments().stream()
                .map(CommentGetDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentNo) {
        Comment comment = commentRepository.findById(commentNo)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다. commentNo: " + commentNo));

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true) // 조회 메소드는 readOnly = true로 설정
    public List<MyCommentGetDto> getMyComments(String userEmail) {
        // CommentRepository에서 userEmail을 기준으로 댓글 목록을 가져옵니다.
        List<Comment> comments = commentRepository.findByMemberUserEmail(userEmail);

        // 가져온 Comment 엔티티 목록을 MyCommentGetDto로 변환하여 반환합니다.
        return comments.stream()
                .map(MyCommentGetDto::fromEntity)
                .collect(Collectors.toList());
    }
}