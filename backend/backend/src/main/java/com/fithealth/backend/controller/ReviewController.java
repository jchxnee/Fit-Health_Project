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

    @GetMapping("/{trainerEmail}")
    public ResponseEntity<List<ReviewSelectDto.Select>> select(@PathVariable String trainerEmail) {
        List<ReviewSelectDto.Select> reviews = reviewService.selectReview(trainerEmail);
        return ResponseEntity.ok(reviews);
    }


}