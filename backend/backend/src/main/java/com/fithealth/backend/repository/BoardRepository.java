package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph; // ⭐ EntityGraph 임포트 ⭐
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>,
        JpaSpecificationExecutor<Board> {

    @EntityGraph(attributePaths = "member")
    Page<Board> findByStatus(CommonEnums.Status status, Pageable pageable);

    Page<Board> findByBoardCategoryNameAndStatus(String boardCategoryName, CommonEnums.Status status, Pageable pageable);
}