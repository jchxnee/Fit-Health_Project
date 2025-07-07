package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Notification.NotificationResponseDto;
import com.fithealth.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // HttpStatus import 추가
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections; // Collections import 추가
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 현재 로그인한 유저의 읽지 않은 알림 개수를 반환하는 API
     * 헤더의 알림 아이콘에 숫자로 표시할 때 사용
     * @param userDetails 현재 로그인한 유저 정보 (Spring Security)
     * @return 읽지 않은 알림 개수를 포함하는 Map
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println(userDetails);

        // userDetails가 null인 경우 예외 처리
        if (userDetails == null) {
            System.out.println("UserDetails is null. User not authenticated.");
            // 401 Unauthorized 상태 코드와 함께 오류 메시지 반환
            // 클라이언트에게 인증이 필요함을 알림
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", 0L)); // count를 0으로 설정하거나, 다른 오류 메시지를 보낼 수 있습니다.
        }

        String userEmail = userDetails.getUsername(); // UserDetails에서 사용자 이메일 추출
        // 변경된 서비스 메서드 이름 사용: notReadNotification
        Long unreadCount = notificationService.notReadNotification(userEmail);
        System.out.println("안읽은 알림은?" + unreadCount);
        Map<String, Long> response = new HashMap<>();
        response.put("count", unreadCount);
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 로그인한 유저의 모든 알림 목록을 반환하는 API
     * 알림 드롭다운 메뉴나 알림 페이지에서 목록을 보여줄 때 사용
     * @param userDetails 현재 로그인한 유저 정보 (Spring Security)
     * @return 알림 목록 DTO 리스트
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails가 null인 경우 예외 처리
        if (userDetails == null) {
            System.out.println("UserDetails is null. User not authenticated for getting all notifications.");
            // 401 Unauthorized 상태 코드와 함께 빈 리스트 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }

        String userEmail = userDetails.getUsername();
        // 변경된 서비스 메서드 이름 사용: getNotification
        List<NotificationResponseDto> notifications = notificationService.getNotification(userEmail)
                .stream()
                .map(NotificationResponseDto::fromEntity) // Notification 엔티티를 NotificationResponseDto로 변환
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    /**
     * 특정 알림을 읽음 상태로 변경하는 API
     * 유저가 알림을 클릭하거나 확인했을 때 호출
     * @param notificationNo 읽음 처리할 알림의 고유 번호
     * @return HTTP 204 No Content
     */
    @PostMapping("/{notificationNo}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationNo) {
        // 변경된 서비스 메서드 이름 사용: readingNotification
        notificationService.readingNotification(notificationNo);
        return ResponseEntity.noContent().build(); // 204 No Content 반환
    }
}
