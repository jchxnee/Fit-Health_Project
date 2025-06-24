package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Notice;
import com.fithealth.backend.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    Page<Notice> findByStatus(CommonEnums.Status status, Pageable pageable);

    Page<Notice> findByNoticeCategoryNameAndStatus(String noticeCategoryName, CommonEnums.Status status, Pageable pageable);

}