package com.fithealth.backend.dto.Notification;

import com.fithealth.backend.entity.Notification;
import com.fithealth.backend.enums.CommonEnums;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponseDto {
    private Long notificationNo;
    private String message;
    private String notificationType; // 알림 타입 (예: PT_APPLICATION_APPROVED, REVIEW_SUBMITTED)
    private Long relatedId;        // 관련 엔티티의 ID (예: paymentId, boardNo, reviewNo)
    private CommonEnums.Status isRead;
    private LocalDateTime createdDate;

    public static NotificationResponseDto fromEntity(Notification notification) {
        return NotificationResponseDto.builder()
                .notificationNo(notification.getNotificationNo())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType())
                .relatedId(notification.getRelatedId())
                .isRead(notification.getIsRead())
                .createdDate(notification.getCreatedDate())
                .build();
    }
}