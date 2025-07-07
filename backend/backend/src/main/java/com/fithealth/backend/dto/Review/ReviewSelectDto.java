package com.fithealth.backend.dto.Review; // 실제 패키지 경로에 맞게 수정

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
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