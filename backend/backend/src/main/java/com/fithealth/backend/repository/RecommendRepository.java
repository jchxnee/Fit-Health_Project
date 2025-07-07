package com.fithealth.backend.repository;

import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import java.util.List;

public interface RecommendRepository {
    List<RecommendExerciseDto> fetchRecommendExercise(BmiRequestDto bmiRequestDto);
}