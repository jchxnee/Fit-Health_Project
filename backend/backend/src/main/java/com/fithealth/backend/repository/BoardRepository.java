package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>,
        JpaSpecificationExecutor<Board> {

    // ⭐ 수정 제안: comments 또는 boardPhoto 중 하나만 남기거나, 아예 제거합니다. ⭐
    // 예를 들어, member만 fetch join 하고 나머지는 lazy 로딩을 유지
    @EntityGraph(attributePaths = {"member"}) // 또는 {"member", "comments"} (comments_count가 더 중요하다면)
    // 또는 {"member", "boardPhoto"} (파일 정보가 더 중요하다면)
    Page<Board> findByStatus(CommonEnums.Status status, Pageable pageable);

    // ⭐ 위와 동일하게 수정 제안 ⭐
    @EntityGraph(attributePaths = {"member"}) // 또는 {"member", "comments"}
    Page<Board> findByBoardCategoryNameAndStatus(String boardCategoryName, CommonEnums.Status status, Pageable pageable);

    // 상세 조회 시에는 모든 컬렉션을 EAGER 로딩하는 것이 좋을 수 있습니다.
    // 하지만 목록 조회와 동일하게 MultipleBagFetchException이 발생할 수 있습니다.
    // 이 부분은 일단 목록 조회 에러를 해결한 후 고려해 보세요.
    // @EntityGraph(attributePaths = {"member", "comments", "boardPhoto"}) // 일단 주석 처리
    // @Override
    // java.util.Optional<Board> findById(Long aLong);
}