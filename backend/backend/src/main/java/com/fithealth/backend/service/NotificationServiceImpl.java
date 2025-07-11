package com.fithealth.backend.service;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Notification;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;

    @Override
    public Notification createNotification(Member targetMember, String message, String notificationType, Long relatedId) {
        // targetMember가 유효한지 확인
        if (targetMember == null) {
            System.err.println("알림 대상에 대한 정보가 없다~ : "  + message);
            throw new IllegalArgumentException("알림을 받을 대상 회원이 유효하지 않습니다.");
        }

        Notification notification = Notification.builder()
                .member(targetMember) // 알림을 받을 멤버
                .message(message)
                .notificationType(notificationType)
                .relatedId(relatedId)
                .isRead(CommonEnums.Status.N) // 기본값은 읽지 않음
                .createdDate(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification); // 저장된 알림 객체 반환
    }

    @Override
    public Notification createSocialNotification(Member targetMember, String message, String notificationType) {
        if (targetMember == null) {
            System.err.println("알림 대상에 대한 정보가 없다~ : "  + message);
            throw new IllegalArgumentException("알림을 받을 대상 회원이 유효하지 않습니다.");
        }
        Notification notification = Notification.builder()
                .member(targetMember) // 알림을 받을 멤버
                .message(message)
                .notificationType(notificationType)
                .isRead(CommonEnums.Status.N) // 기본값은 읽지 않음
                .createdDate(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification); // 저장된 알림 객체 반환
    }

    @Override
    @Transactional(readOnly = true)
    public Long notReadNotification(String userEmail) {
        Member member = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다: " + userEmail));
        return notificationRepository.countNotification(userEmail, CommonEnums.Status.N);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotification(String userEmail) {
        Member member = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다: " + userEmail));
        return notificationRepository.selectNotification(userEmail);
    }

    @Override
    public void readingNotification(Long notificationNo) {
        Notification notification = notificationRepository.findById(notificationNo)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다: " + notificationNo));
        notification.setIsRead(CommonEnums.Status.Y); // 읽음으로 변경
        notificationRepository.save(notification);

    }
}