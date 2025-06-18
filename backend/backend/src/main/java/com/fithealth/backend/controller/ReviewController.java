package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

//    @PostMapping
//    public ResponseEntity<String> createReview(@ModelAttribute ReviewCreateDto.Create reviewCreate) throws IOException {
//        return ResponseEntity.ok(reviewService.createReview());
//    }
}
