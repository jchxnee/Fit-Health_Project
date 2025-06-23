package com.fithealth.backend.dto.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

public class SelectMyReviewDto { // 새로운 DTO
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Select {
        private Long reviewId;
        private String reviewContent;
        private Double rating;
        private String trainerName;
        private LocalDateTime createdAt;
        private String reviewImage;
        private int recommendCount;
    }
}