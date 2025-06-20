package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Review;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review); // 저장 또는 업데이트
    List<Review> findByPaymentId(List<Long> paymentIds); // 전체 조회
}