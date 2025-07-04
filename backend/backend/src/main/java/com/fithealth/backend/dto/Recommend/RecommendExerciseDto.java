package com.fithealth.backend.dto.Recommend;

import lombok.Data;

@Data
public class RecommendExerciseDto {
    private String exerciseName;
    private String exerciseTarget;
    private String exerciseItem;
    private Long exerciseWeight;
    private Long exerciseCount;
    private Long exerciseSet;
} 