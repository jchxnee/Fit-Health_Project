package com.fithealth.backend.dto.Trainer;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

public class UpdateTrainerDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long trainerNo;
        private String majorName, wishArea, kakaoId, instaId, introduce;
        private Long oncePrice, discount3, discount5, discount10;
        private List<String> careers = new ArrayList<>();
        private List<addTrainerDto.FileRequest> trainerPhoto = new ArrayList<>();
    }
} 