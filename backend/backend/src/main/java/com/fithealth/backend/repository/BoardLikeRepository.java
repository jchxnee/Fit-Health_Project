package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardLike;
import com.fithealth.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, BoardLike.BoardLikeId> {
    // 특정 게시물에 대한 특정 사용자의 좋아요 여부 확인
    Optional<BoardLike> findByBoardAndMember(Board board, Member member);

    Optional<Object> findByBoardAndMemberUserEmail(Board board, String currentUserEmail);

    // 특정 게시물에 대한 좋아요 수 조회 (Board 엔티티의 heart 필드를 사용하므로 이 메서드는 직접 사용되지 않을 수 있음)
    // long countByBoard(Board board);
}