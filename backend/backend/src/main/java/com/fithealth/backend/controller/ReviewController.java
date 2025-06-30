package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.Top5BoardDto;
import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.dto.Review.SelectMyReviewDto;
import com.fithealth.backend.dto.Review.Top6ReviewDto;
import com.fithealth.backend.dto.member.LoginDto; // LoginDto 임포트
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Review> create(@ModelAttribute ReviewCreateDto.Create reviewCreateDto) {
        return ResponseEntity.ok(reviewService.createReview(reviewCreateDto));
    }

    @GetMapping("/{trainerNo}") // 트레이너 상세창에서 리뷰 전체보기를 눌렀을때 트레이너 번호 받는 컨트롤러
    public ResponseEntity<List<ReviewSelectDto.Select>> select(@PathVariable Long trainerNo) { // 2. @PathVariable 타입 및 변수명 변경: Long trainerNo
        System.out.println("컨트롤러가 받은 트레이너 번호 : " + trainerNo);
        List<ReviewSelectDto.Select> reviews = reviewService.selectByTrainerNo(trainerNo); // 3. 서비스 메서드 호출명 변경
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my") // "내가 작성한 리뷰" 목록을 위한 엔드포인트
    public ResponseEntity<List<SelectMyReviewDto.Select>> getMyReviews(@RequestParam String userEmail) {
        System.out.println("컨트롤러가 받은 사용자 이메일: " + userEmail);
        // userEmail을 사용하여 해당 사용자의 리뷰를 조회하는 서비스 메서드 호출
        List<SelectMyReviewDto.Select> myReviews = reviewService.selectByUserEmail(userEmail);
        return ResponseEntity.ok(myReviews);
    }

    @GetMapping("/exsists/{paymentId}")
    public ResponseEntity<Boolean> findReview(@PathVariable Long paymentId) {
        System.out.println("프론트에서 받은 결제번호 : " + paymentId);
        boolean exists = reviewService.findOne(paymentId);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        System.out.println("프론트에서 받은 리뷰 아이디 : " + id);
        reviewService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top6")
    public ResponseEntity<List<Top6ReviewDto.Response>> getReviewTop6() {
        return ResponseEntity.ok(reviewService.getReviewTop6());
    }
}