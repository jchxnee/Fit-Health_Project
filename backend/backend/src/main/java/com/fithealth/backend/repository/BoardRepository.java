package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>,
        JpaSpecificationExecutor<Board> {

    @EntityGraph(attributePaths = {"member"})
    Page<Board> findByStatus(CommonEnums.Status status, Pageable pageable);

    @EntityGraph(attributePaths = {"member"})
    Page<Board> findByBoardCategoryNameAndStatus(String boardCategoryName, CommonEnums.Status status, Pageable pageable);

    Optional<Board> findById(Long boardNo);

    @Modifying // 이 쿼리가 DB를 수정함을 나타냅니다.
    @Transactional // 이 작업이 트랜잭션 내에서 수행되도록 합니다. (필수!)
    @Query("UPDATE Board b SET b.status = 'N' WHERE b.boardNo = :boardNo")
    void updateStatusToInactive(@Param("boardNo") Long boardNo);
}