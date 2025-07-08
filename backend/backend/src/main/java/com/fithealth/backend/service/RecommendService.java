package com.fithealth.backend.service;

import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import java.util.List;
 
public interface RecommendService {
    List<RecommendExerciseDto> getRecommendExercise(BmiRequestDto bmiRequestDto);
} 