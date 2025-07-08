package com.fithealth.backend.service;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Notification;
import java.util.List;

public interface NotificationService {
    // 알림을 생성하고 저장하는 메서드
    Notification createNotification(Member targetMember, String message, String notificationType, Long relatedId);

    Notification createSocialNotification(Member targetMember, String message, String notificationType);
    // 특정 유저의 읽지 않은 알림 개수를 조회하는 메서드 (헤더 알림 아이콘에 표시)
    Long notReadNotification(String userEmail);

    // 특정 유저의 모든 알림을 조회하는 메서드 (알림 목록 페이지)
    List<Notification> getNotification(String userEmail);

    // 알림을 '읽음' 상태로 변경하는 메서드
    void readingNotification(Long notificationNo);
}