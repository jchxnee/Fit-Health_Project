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
        System.out.println("--- DEBUG: RecommendService.getRecommendExercise 메서드 진입 ---");
        System.out.println("DEBUG: BmiRequestDto 정보: " + bmiRequestDto.toString()); // DTO 내용 출력

        try {
            List<RecommendExerciseDto> result = recommendRepository.fetchRecommendExercise(bmiRequestDto);
            System.out.println("--- DEBUG: RecommendRepository 호출 성공, 결과 반환 ---");
            return result;
        } catch (Exception e) {
            // 여기에 강제로 예외 스택 트레이스 출력
            System.err.println("--- FATAL ERROR: RecommendService에서 예외 발생 ---");
            e.printStackTrace(System.err); // System.err에 출력
            throw new RuntimeException("운동 추천 서비스 처리 중 오류 발생", e); // 더 상위로 예외 던져서 확인
        }
    }
} 