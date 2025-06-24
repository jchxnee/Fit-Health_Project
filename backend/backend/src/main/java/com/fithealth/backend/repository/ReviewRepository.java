package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Review;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository {
    Review save(Review review);
    List<Review> findByPaymentId(List<Long> paymentIds);
    List<Review> findReviewsByUserEmailWithPaymentAndMembers(String userEmail);
    Boolean findOne(Long paymentId);
}