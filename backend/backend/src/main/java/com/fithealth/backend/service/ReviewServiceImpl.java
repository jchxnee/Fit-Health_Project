package com.fithealth.backend.service;

import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.enums.CommonEnums; // CommonEnums를 사용하고 있으므로 import 필요
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.PaymentRepository; // PaymentRepository 임포트
import com.fithealth.backend.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;

    @Override
    public Review createReview(ReviewCreateDto.Create reviewCreateDto) { // 반환 타입을 Review로 변경

        Payment payment = paymentRepository.findOne(reviewCreateDto.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));


        if (payment.getReview() != null) {
            throw new IllegalStateException("이미 이 결제에 대한 리뷰가 존재합니다.");
        }

        Review review = Review.builder()
                .payment(payment)
                .reviewContent(reviewCreateDto.getReviewContent())
                .rating(reviewCreateDto.getRating())
                .heart(reviewCreateDto.getHeart())
                .build();

        Review savedReview = reviewRepository.save(review);

        payment.setReview(savedReview);
        return savedReview;
    }

    @Override
    public List<ReviewSelectDto.Select> selectReview(String trainerEmail) {
        List<Long> paymentIds = paymentRepository.findbyTrainerEmail(trainerEmail);

        if(paymentIds.isEmpty()) {
            return List.of();
        }
        List<Review> reviews = reviewRepository.findReviews(paymentIds);
        return reviews.stream()
                .map(review -> {
                    // Review 엔티티에서 Payment 객체 가져옴
                    Payment payment = review.getPayment();

                    String userName = "알 수 없음";
                    String userProfileImage = null;

                    if (payment != null) {
                        String userEmail = payment.getMember().getUserEmail(); // Payment에서 Member의 userEmail 가져옴

                        // MemberRepository를 사용하여 사용자 정보 (이름, 프로필 이미지) 조회
                        Optional<Member> optionalMember = memberRepository.findOne(userEmail);
                        if (optionalMember.isPresent()) {
                            Member member = optionalMember.get();
                            userName = member.getUserName();
                            userProfileImage = member.getProfileImage();
                        } else {
                            userName = userEmail; // 멤버 정보가 없으면 이메일 표시
                        }
                    }

                    // Review 엔티티의 changeName 필드를 reviewImage로 매핑
                    String reviewImage = review.getChangeName();

                    return ReviewSelectDto.Select.builder()
                            .reviewId(review.getReviewNo())
                            .reviewContent(review.getReviewContent())
                            .rating(review.getRating())
                            .userName(userName)
                            .createdAt(review.getCreatedDate())
                            .recommendCount(review.getHeart().intValue())
                            .reviewImage(reviewImage)
                            .userProfileImage(userProfileImage)
                            .build();
                })
                .collect(Collectors.toList());
    }
}