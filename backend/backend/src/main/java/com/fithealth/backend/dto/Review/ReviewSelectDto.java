package com.fithealth.backend.dto.Review; // 실제 패키지 경로에 맞게 수정

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder; // @Builder 추가 (선택 사항이지만 DTO 생성 시 유용)

import java.time.LocalDate; // 또는 LocalDateTime, 리뷰 생성 날짜 타입에 맞게
import java.time.LocalDateTime;

public class ReviewSelectDto {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Select {

        private Long reviewId;
        private String reviewContent;
        private Double rating;
        private String userName;
        private LocalDateTime createdAt;
        private String reviewImage;
        private int recommendCount;
        private String userProfileImage;
    }
}