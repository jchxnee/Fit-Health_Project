package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Review;
import com.fithealth.backend.enums.CommonEnums;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review);
    List<Review> findByPaymentId(List<Long> paymentIds);
    List<Review> findReviewsByUser(String userEmail);
    Boolean findOne(Long paymentId);
    void delete(Long reviewId);
    List<Review> getTop6(CommonEnums.Status status);
}