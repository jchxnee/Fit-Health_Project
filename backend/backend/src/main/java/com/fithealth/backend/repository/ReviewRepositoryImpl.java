package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Review;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Status;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // @Transactional 추가

import java.util.List;
import java.util.Optional;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @PersistenceContext // EntityManager 주입
    private EntityManager em;

    @Override
    @Transactional
    public Review save(Review review) {
        if (review.getReviewNo() == null) {
            em.persist(review);
            return review;
        } else {
            return em.merge(review);
        }
    }

    @Override
    @Transactional(readOnly = true) // 조회는 readOnly 트랜잭션
    public List<Review> findByPaymentId(List<Long> paymentIds) {
        // Review와 Payment를 조인하여 Payment ID 목록으로 필터링
        // ReviewSelectDto.Select에 userName, userProfileImage가 필요하므로 p.member도 JOIN FETCH
        return em.createQuery(
                        "SELECT r FROM Review r " +
                                "JOIN FETCH r.payment p " +
                                "JOIN FETCH p.member m " + // 결제자 Member 정보
                                "WHERE p.paymentId IN :paymentIds ORDER BY r.createdDate DESC", Review.class)
                .setParameter("paymentIds", paymentIds)
                .getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> findReviewsByUser(String userEmail) {
        return em.createQuery(
                        "SELECT r FROM Review r " +
                                "JOIN FETCH r.payment p " +          // Review와 Payment 조인
                                "JOIN FETCH p.member m " +           // Payment와 결제자(리뷰 작성자) Member 조인
                                "JOIN FETCH p.responseMember rm " +  // Payment와 응답자(트레이너) Member 조인
                                "WHERE m.userEmail = :userEmail AND r.status = 'Y' " +  // 리뷰 작성자(Member)의 이메일로 필터링
                                "ORDER BY r.createdDate DESC", Review.class) // 최신순 정렬 (선택 사항)
                .setParameter("userEmail", userEmail)
                .getResultList();

    }

    @Override
    public Boolean findOne(Long paymentId) {
        if(paymentId == null) {
            return false;
        }
        else{
            try {
                List<Review> result = em.createQuery("SELECT r FROM Review r "
                                + "WHERE r.payment.paymentId = :paymentId", Review.class) // 쿼리 결과의 타입을 Review.class로 명시
                        .setParameter("paymentId", paymentId)
                        .setMaxResults(1)
                        .getResultList();

                return !result.isEmpty();

            } catch (Exception e) {
                System.err.println("결제번호로 리뷰를 찾을 수 없습니다. " + e.getMessage());
                return false;
            }
        }
    }

    @Override
    public void delete(Long reviewId) {
        Review review = em.find(Review.class, reviewId);
        if(review != null){
            review.setStatus(Status.N);
            em.merge(review);
        }else{
            throw new IllegalArgumentException("해당 리뷰아이디 :  " + reviewId + "에 대한 리뷰가 없습니다.");
        }
    }

    @Override
    public List<Review> getTop6(CommonEnums.Status status) {
        String jpql = "SELECT r FROM Review r " +
                "JOIN r.payment p " +
                "JOIN p.responseMember m " +
                "WHERE r.status = :reviewStatus " +
                "AND m.status = :memberStatus " +
                "ORDER BY r.createdDate DESC";

        return em.createQuery(jpql, Review.class)
                .setParameter("reviewStatus", status)
                .setParameter("memberStatus", CommonEnums.Status.Y)
                .setMaxResults(6)
                .getResultList();
    }

}
