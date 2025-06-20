package com.fithealth.backend.service;

import com.fithealth.backend.dto.Comment.CommentCreateDto;
import com.fithealth.backend.dto.Comment.CommentGetDto;
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
    @Transactional(readOnly = true) // 조회 메소드는 readOnly = true로 설정하여 성능 최적화
    public List<CommentGetDto> getCommentsByBoardNo(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시물을 찾을 수 없습니다."));

        return board.getComments().stream()
                .map(CommentGetDto.Response::toDto) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }
}