package com.fithealth.backend.dto.Trainer;

import lombok.*;

public class SelectTrainerDto {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Response {

        private String trainerName;
        private Double rating;
        private Long trainerNo;
        private String wishArea;
        private String majorName;
        private Long reviews;
        private String profileImg;

        public Response(Long trainerNo, String trainerName, String wishArea,
                        String majorName, String profileImg, Double rating, Long reviews) {
            this.trainerNo = trainerNo;
            this.trainerName = trainerName;
            this.wishArea = wishArea;
            this.majorName = majorName;
            this.profileImg = profileImg;
            this.rating = rating != null ? rating : 0.0;
            this.reviews = reviews != null ? reviews : 0L;
        }
    }
}