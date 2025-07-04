package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.enums.CommonEnums;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // 기존 메서드들...
    Page<Board> findByStatus(CommonEnums.Status status, Pageable pageable);
    Page<Board> findByBoardCategoryNameAndStatus(String boardCategoryName, CommonEnums.Status status, Pageable pageable);

    // 기본 내 게시물 조회 (검색어 없음)
    Page<Board> findByMemberUserEmailAndStatus(String memberUserEmail, CommonEnums.Status status, Pageable pageable);
    Page<Board> findByMemberUserEmailAndBoardCategoryNameAndStatus(String memberUserEmail, String boardCategoryName, CommonEnums.Status status, Pageable pageable);

    // 검색 기능이 추가된 내 게시물 조회 메서드들
    @Query("SELECT b FROM Board b WHERE b.member.userEmail = :userEmail AND b.status = :status " +
            "AND (b.boardTitle LIKE %:search% OR b.boardContent LIKE %:search%)")
    Page<Board> findByMemberUserEmailAndStatusAndSearch(
            @Param("userEmail") String userEmail,
            @Param("status") CommonEnums.Status status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT b FROM Board b WHERE b.member.userEmail = :userEmail AND b.status = :status " +
            "AND b.boardCategoryName = :category " +
            "AND (b.boardTitle LIKE %:search% OR b.boardContent LIKE %:search%)")
    Page<Board> findByMemberUserEmailAndStatusAndCategoryAndSearch(
            @Param("userEmail") String userEmail,
            @Param("status") CommonEnums.Status status,
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable);

    // 게시글 상태를 N으로 변경하는 쿼리 (delete 메소드에서 사용)
    @Modifying
    @Query("UPDATE Board b SET b.status = 'N' WHERE b.boardNo = :boardNo")
    void updateStatusToInactive(@Param("boardNo") Long boardNo);

    //조회순으로 높은 게시글 5개
    List<Board> findTop5ByStatusOrderByCountDesc(CommonEnums.Status status);
}