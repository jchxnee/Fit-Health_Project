package com.fithealth.backend.dto.Health;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.entity.Health;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import lombok.*;

import java.time.LocalDateTime;

public class HealthCreateDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create{
        private String user_email;
        private Double weight;
        private Double body_fat;
        private Double skeletal_muscle;

        public Health toEntity(){
            return Health.builder()
                    .weight(this.weight)
                    .bodyFat(this.body_fat)
                    .skeletalMuscle(this.skeletal_muscle)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private String user_email;
        private Double weight;
        private Double body_fat;
        private Double skeletal_muscle;
        private LocalDateTime create_date;

        public static HealthCreateDto.Response toDto(Health health){
            return Response.builder()
                    .user_email(health.getMember().getUserEmail())
                    .weight(health.getWeight())
                    .body_fat(health.getBodyFat())
                    .skeletal_muscle(health.getSkeletalMuscle())
                    .create_date(health.getCreateDate())
                    .build();
        }

    }
}
