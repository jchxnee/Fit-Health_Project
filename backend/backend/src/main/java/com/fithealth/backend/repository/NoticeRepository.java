package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Notice;
import com.fithealth.backend.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    Page<Notice> findByStatus(CommonEnums.Status status, Pageable pageable);

    Page<Notice> findByNoticeCategoryNameAndStatus(String noticeCategoryName, CommonEnums.Status status, Pageable pageable);

    @Modifying // 이 쿼리가 DB를 수정함을 나타냅니다.
    @Transactional // 이 작업이 트랜잭션 내에서 수행되도록 합니다. (필수!)
    @Query("UPDATE Notice n SET n.status = 'N' WHERE n.noticeNo = :noticeNo")
    void updateStatusToInactive(@Param("noticeNo") Long noticeNo);
}