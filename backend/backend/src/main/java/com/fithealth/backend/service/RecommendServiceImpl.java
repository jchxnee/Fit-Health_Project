package com.fithealth.backend.service;

import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import com.fithealth.backend.repository.RecommendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {
    private final RecommendRepository recommendRepository;

    @Override
    public List<RecommendExerciseDto> getRecommendExercise(BmiRequestDto bmiRequestDto) {
        return recommendRepository.fetchRecommendExercise(bmiRequestDto);
    }
} 