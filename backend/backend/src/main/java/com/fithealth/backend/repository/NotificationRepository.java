package com.fithealth.backend.repository;

import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.entity.Notification; // Ensure this import path is correct: com.fithealth.backend.entity.Notification
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.member.userEmail = :userEmail AND n.isRead = :status")
    Long countNotification(@Param("userEmail") String userEmail, @Param("status") CommonEnums.Status status);

    @Query("SELECT n FROM Notification n WHERE n.member.userEmail = :userEmail AND n.isRead = 'N' ORDER BY n.createdDate DESC") // 최신순 정렬 추가
    List<Notification> selectNotification(@Param("userEmail") String userEmail);

    // JpaRepository 기본 메서드 findById(), save() 등은 자동 제공
}