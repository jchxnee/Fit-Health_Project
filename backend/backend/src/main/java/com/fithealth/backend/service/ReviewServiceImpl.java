package com.fithealth.backend.service;

import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.enums.CommonEnums; // CommonEnums를 사용하고 있으므로 import 필요
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.PaymentRepository; // PaymentRepository 임포트
import com.fithealth.backend.repository.ReviewRepository;
import com.fithealth.backend.repository.TrainerRepository;
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
    private final TrainerRepository trainerRepository;

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
    @Transactional(readOnly = true)
    public List<ReviewSelectDto.Select> selectByTrainerNo(Long trainerNo) {

            System.out.println("ReviewServiceImpl: Attempting to fetch reviews for TRAINER_NO: " + trainerNo);

            // 1. trainerNo로 Trainer 정보를 조회하여 trainerEmail을 얻어냄
            Optional<Member> member = memberRepository.findByTrainerNo(trainerNo);

            if (member.isEmpty()) {
                System.out.println("ReviewServiceImpl: Trainer with No " + trainerNo + " not found. Returning empty list.");
                return List.of(); // 해당 트레이너가 없으면 빈 리스트 반환
            }

            String trainerEmail = member.get().getUserEmail();
            System.out.println("ReviewServiceImpl: Found trainerEmail '" + trainerEmail + "' for trainer No: " + trainerNo);

            // 2. trainerEmail을 사용하여 Payment ID 목록을 조회
            List<Long> paymentIds = paymentRepository.findByResponseEmail(trainerEmail) // PaymentRepository에 이 메서드 정의 필요
                    .stream()
                    .collect(Collectors.toList());

            System.out.println("ReviewServiceImpl: Found " + paymentIds.size() + " payment IDs for trainerEmail: " + trainerEmail);

            if (paymentIds.isEmpty()) {
                System.out.println("해당 트레이너에 대한 결제내역이 없음");
                return List.of(); // 해당 트레이너의 결제 기록이 없으면 빈 리스트 반환
            }

            // 3. 조회된 paymentIds 목록을 사용하여 Review 엔티티 리스트를 조회
            // Review 엔티티가 Payment 엔티티와의 @ManyToOne 관계를 가지고 있다면,
            // review.getPayment().getPaymentId() 등으로 Payment ID에 접근할 수 있습니다.
            // 여기서는 Payment ID 리스트를 받아 리뷰를 찾는 메서드를 사용합니다.
            List<Review> reviews = reviewRepository.findByPaymentId(paymentIds); // ReviewRepository에 이 메서드 정의 필요

            System.out.println("ReviewServiceImpl: Found " + reviews.size() + " reviews for these payment IDs.");

            // 4. Review 엔티티들을 DTO로 변환
            return reviews.stream()
                    .map(review -> {
                        String userName = "알 수 없음";
                        String userProfileImage = null;

                        // Review 엔티티가 Payment를 직접 참조하고, Payment가 Member를 참조하는 구조를 가정
                        // review.getPayment().getMember()를 통해 Member 엔티티에 접근
                        Payment payment = review.getPayment(); // Review 엔티티에 getPayment() 메서드 필요

                        if (payment != null && payment.getMember() != null) {
                            // Payment 엔티티에 getMember()가 있고 Member 엔티티가 getEmail()이 있다면
                            String userEmail = payment.getMember().getUserEmail(); // Member 엔티티에 getUserEmail() 메서드 필요

                            // MemberRepository를 사용하여 사용자 정보 (이름, 프로필 이미지) 조회 (Lazy Loading 고려)
                            // 만약 payment.getMember()가 이미 모든 정보를 로드한다면 이 단계는 생략 가능
                            Optional<Member> optionalMember = memberRepository.findByUserEmail(userEmail); // MemberRepository에 이 메서드 정의 필요
                            if (optionalMember.isPresent()) {
                                Member member = optionalMember.get();
                                userName = member.getUserName(); // Member 엔티티에 getUserName() 메서드 필요
                                userProfileImage = member.getProfileImage(); // Member 엔티티에 getProfileImage() 메서드 필요
                            } else {
                                userName = userEmail; // 멤버 정보가 없으면 이메일 표시 (폴백)
                            }
                        }

                        String reviewImage = review.getChangeName(); // Review 엔티티에 getChangeName() (리뷰 이미지) 메서드 필요
                        Long recommendCount = review.getHeart(); // Review 엔티티에 getHeart() (추천수) 메서드 필요

                        return ReviewSelectDto.Select.builder()
                                .reviewId(review.getReviewNo()) // Review 엔티티에 getReviewNo() 메서드 필요
                                .reviewContent(review.getReviewContent())
                                .rating(review.getRating())
                                .userName(userName)
                                .createdAt(review.getCreatedDate()) // Review 엔티티에 getCreatedDate() 메서드 필요
                                .recommendCount(recommendCount != null ? recommendCount.intValue() : 0) // Long을 Integer로 변환, null 체크
                                .reviewImage(reviewImage)
                                .userProfileImage(userProfileImage)
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        // ★★★ selectByTrainerNo 메서드 변경 끝 ★★★
        }
