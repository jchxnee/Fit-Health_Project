package com.fithealth.backend.service;

import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.dto.Review.SelectMyReviewDto;
import com.fithealth.backend.dto.Review.Top6ReviewDto;
import com.fithealth.backend.dto.Review.Top6ReviewDto.Response;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Review;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Status;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.PaymentRepository;
import com.fithealth.backend.repository.ReviewRepository;
import com.fithealth.backend.repository.TrainerRepository;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final NotificationService notificationService;
    private final TrainerRepository trainerRepository;
    private final String UPLOAD_PATH = "C:\\Wallpaper";
    @Override
    public Review createReview(ReviewCreateDto.Create reviewCreateDto) { // 반환 타입을 Review로 변경

        Payment payment = paymentRepository.findOne(reviewCreateDto.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));


        if (payment.getReview() != null && payment.getReview().getStatus() == Status.Y) {
            throw new IllegalStateException("이미 이 결제에 대한 리뷰가 존재합니다.");
        }

        Review review = Review.builder()
                .payment(payment)
                .reviewContent(reviewCreateDto.getReviewContent())
                .rating(reviewCreateDto.getRating())
                .heart(reviewCreateDto.getHeart())
                .originName(reviewCreateDto.getOriginName())
                .changeName(reviewCreateDto.getChangeName())
                .build();

        Review savedReview = reviewRepository.save(review);

        payment.setReview(savedReview);

        Member trainerMember = payment.getResponseMember();
        Member userMember = payment.getMember();

        if (trainerMember != null && userMember != null) {
            String message = String.format("%s님이 코치님에 대한 리뷰를 작성했습니다. 확인해보세요!",
                    userMember.getUserName() != null ? userMember.getUserName() : userMember.getUserEmail());
            String notificationType = "REVIEW_SUBMITTED";
            Long relatedId = savedReview.getReviewNo();

            notificationService.createNotification(trainerMember, message, notificationType, relatedId);
        } else {
            System.err.println("알림에 대해 저장할 유저나 트레이너 멤버가 없습니다.");
        }


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


        List<Review> reviews = reviewRepository.findByPaymentId(paymentIds); // ReviewRepository에 이 메서드 정의 필요

        System.out.println("ReviewServiceImpl: Found " + reviews.size() + " reviews for these payment IDs.");

        // 4. Review 엔티티들을 DTO로 변환
        return reviews.stream()
                .map(review -> {
                    String userName = "알 수 없음";
                    String userProfileImage = null;

                    Payment payment = review.getPayment(); // Review 엔티티에 getPayment() 메서드 필요

                    if (payment != null && payment.getMember() != null) {
                        // Payment 엔티티에 getMember()가 있고 Member 엔티티가 getEmail()이 있다면
                        String userEmail = payment.getMember().getUserEmail(); // Member 엔티티에 getUserEmail() 메서드 필요

                        // MemberRepository를 사용하여 사용자 정보 (이름, 프로필 이미지) 조회 (Lazy Loading 고려)
                        // 만약 payment.getMember()가 이미 모든 정보를 로드한다면 이 단계는 생략 가능
                        Optional<Member> optionalMember = memberRepository.findByUserEmail(userEmail); // MemberRepository에 이 메서드 정의 필요
                        if (optionalMember.isPresent()) {
                            Member usermember = optionalMember.get();
                            userName = usermember.getUserName(); // Member 엔티티에 getUserName() 메서드 필요
                            userProfileImage = usermember.getProfileImage(); // Member 엔티티에 getProfileImage() 메서드 필요
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

    @Override
    @Transactional(readOnly = true)
    public List<SelectMyReviewDto.Select> selectByUserEmail(String userEmail) {

        System.out.println("ReviewServiceImpl: 사용자 이메일로 내가 쓴 리뷰 조회 시도: " + userEmail);

        // 1. ReviewRepository의 커스텀 메서드를 호출하여 리뷰 목록을 조회합니다.
        // 이 메서드는 Review, Payment, 그리고 Payment에 연결된 Member (작성자 및 트레이너) 정보를 모두 페치 조인하여 가져옵니다.
        List<Review> reviews = reviewRepository.findReviewsByUser(userEmail);

        System.out.println("ReviewServiceImpl: 조회된 리뷰 수: " + reviews.size());

        // 2. 조회된 리뷰 목록이 비어있는 경우 빈 리스트를 반환합니다.
        if (reviews.isEmpty()) {
            System.out.println("해당 사용자가 작성한 리뷰가 없습니다.");
            return List.of(); // Java 9+에서 불변의 빈 리스트 생성
        }

        // 3. Review 엔티티 목록을 SelectMyReviewDto.Select DTO 목록으로 변환합니다.
        return reviews.stream()
                .map(review -> {
                    String trainerName = "알 수 없음";
                    // reviewRepository 쿼리에서 이미 responseMember(트레이너)가 페치 조인되었으므로, 안전하게 접근 가능합니다.
                    // ERD에 따르면 Payment 테이블의 RESPONSE_EMAIL이 Member 테이블의 USER_EMAIL을 참조합니다.
                    // 즉, review.getPayment().getResponseMember()는 트레이너의 Member 엔티티입니다.
                    if (review.getPayment() != null && review.getPayment().getResponseMember() != null) {
                        trainerName = review.getPayment().getResponseMember().getUserName();
                    }

                    // 추천수 (heart)가 null일 경우 0으로 처리
                    int recommendCount = (review.getHeart() != null) ? review.getHeart().intValue() : 0;

                    // 리뷰 이미지 (changeName)
                    String reviewImage = review.getChangeName(); // 또는 review.getOriginName() 등 실제 이미지 경로 필드 사용

                    return SelectMyReviewDto.Select.builder()
                            .reviewId(review.getReviewNo()) // ERD: REVIEW_NO
                            .reviewContent(review.getReviewContent())
                            .rating(review.getRating())
                            .trainerName(trainerName)
                            .createdAt(review.getCreatedDate())
                            .reviewImage(reviewImage)
                            .recommendCount(recommendCount)
                            .build();
                })
                .collect(Collectors.toList());

    }

    @Override
    public Boolean findOne(Long paymentId) {
        return reviewRepository.findOne(paymentId);
    }

    @Override
    public void delete(Long reviewId) {
        reviewRepository.delete(reviewId);
    }

    @Override
    public List<Top6ReviewDto.Response> getReviewTop6() {
        return reviewRepository.getTop6(CommonEnums.Status.Y).stream()
                .map(Top6ReviewDto.Response::fromEntity)
                .collect(Collectors.toList());
    }
}