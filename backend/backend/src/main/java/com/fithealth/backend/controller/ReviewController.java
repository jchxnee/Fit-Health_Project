package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.dto.member.LoginDto; // LoginDto 임포트
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> create(@RequestBody ReviewCreateDto.Create reviewCreateDto) {
        return ResponseEntity.ok(reviewService.createReview(reviewCreateDto));
    }

    @GetMapping("/{trainerNo}") // 1. PathVariable 이름 변경: {trainerNo}
    public ResponseEntity<List<ReviewSelectDto.Select>> select(@PathVariable Long trainerNo) { // 2. @PathVariable 타입 및 변수명 변경: Long trainerNo
        System.out.println("ReviewController: Received request for trainer No: " + trainerNo); // 디버깅 로그 추가
        List<ReviewSelectDto.Select> reviews = reviewService.selectByTrainerNo(trainerNo); // 3. 서비스 메서드 호출명 변경
        return ResponseEntity.ok(reviews);
    }


}