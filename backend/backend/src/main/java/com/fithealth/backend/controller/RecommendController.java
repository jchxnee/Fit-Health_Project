package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import com.fithealth.backend.service.RecommendService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private final RecommendService recommendService;

    @PostMapping("/exercise")
    public ResponseEntity<List<RecommendExerciseDto>> recommendExercise(@RequestBody BmiRequestDto bmiRequestDto) {
        List<RecommendExerciseDto> result = recommendService.getRecommendExercise(bmiRequestDto);
        return ResponseEntity.ok(result);
    }
} 