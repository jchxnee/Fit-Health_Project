package com.fithealth.backend.dto.Review;

import com.fithealth.backend.entity.Review;
import com.fithealth.backend.enums.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

public class ReviewCreateDto {

    @Getter
    @AllArgsConstructor
    public static class Create {
        private Long heart;
        private Double rating;
        private String review_Content;
        private LocalDateTime createdDate;
        private CommonEnums.Status status;

        public Review toEntity() {
            return Review.builder()
                    .heart(this.heart)
                    .rating(this.rating)
                    .reviewContent(this.review_Content)
                    .build();
        }
    }
}
