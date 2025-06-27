package com.fithealth.backend.dto.Trainer;

import com.fithealth.backend.entity.Trainer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class Top3TrainerDto {
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long trainer_no;
        private String trainer_name;
        private String profile_image;

        public static Top3TrainerDto.Response fromEntity(Trainer trainer) {
            return Response.builder()
                    .trainer_no(trainer.getTrainerNo())
                    .trainer_name(trainer.getMember().getUserName())
                    .profile_image(trainer.getMember().getProfileImage())
                    .build();
        }
    }
}
