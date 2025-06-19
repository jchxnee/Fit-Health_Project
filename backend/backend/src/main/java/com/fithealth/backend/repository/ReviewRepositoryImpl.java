package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Review;
import com.fithealth.backend.entity.Payment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @PersistenceContext
    private EntityManager em;


    @Override
    public Review save(Review review) {
      em.persist(review);
      return review;
    }


    @Override
    public List<Review> findByPaymentId(List<Long> paymentIds) {
        return em.createQuery(
                        "SELECT r FROM Review r WHERE r.payment.paymentId IN :paymentIds ORDER BY r.createdDate DESC", Review.class)
                .setParameter("paymentIds", paymentIds)
                .getResultList();
    }
}




