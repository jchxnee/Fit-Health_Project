package com.fithealth.backend.dto.Review;

import com.fithealth.backend.entity.Review;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class Top6ReviewDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long review_no;
        private String user_name;
        private String trainer_name;
        private Long trainer_no;
        private String review_content;
        private String profile_image;
        private Double rating;
        private LocalDateTime created_date;

        public static Top6ReviewDto.Response fromEntity(Review review) {
            return Response.builder()
                    .review_no(review.getReviewNo())
                    .user_name(review.getPayment().getMember().getUserName())
                    .trainer_name(review.getPayment().getResponseMember().getUserName())
                    .trainer_no(review.getPayment().getResponseMember().getTrainer().getTrainerNo())
                    .review_content(review.getReviewContent())
                    .profile_image(review.getPayment().getMember().getProfileImage())
                    .rating(review.getRating())
                    .created_date(review.getCreatedDate())
                    .build();
        }
    }
}
