package com.fithealth.backend.dto.Review;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



public class ReviewCreateDto {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {
        private Long paymentId;
        private String reviewContent;
        private Double rating;
        private Long heart;

        public Review toEntity() {
            return Review.builder()
                    .reviewContent(this.reviewContent)
                    .rating(this.rating)
                    .heart(this.heart)
                    .build();
        }
    }
}