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
        // Board 엔티티를 찾아서 그 Board에 연관된 댓글들을 가져오거나
        // CommentRepository에 findByBoardNo 같은 메소드를 추가할 수 있습니다.
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시물을 찾을 수 없습니다."));

        // Board 엔티티에 comments 필드가 OneToMany로 잘 매핑되어 있다면 바로 접근 가능
        // N+1 문제 방지를 위해 Fetch Join을 사용하는 것이 좋습니다 (JPA Repository에서 구현)
        // 예: List<Comment> comments = commentRepository.findByBoard_BoardNoWithMember(boardNo);
        return board.getComments().stream()
                .map(CommentGetDto::fromEntity) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentNo) {
        Comment comment = commentRepository.findById(commentNo)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다. commentNo: " + commentNo));

        commentRepository.delete(comment);
    }
}