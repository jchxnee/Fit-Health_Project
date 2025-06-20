package com.fithealth.backend.service;

import com.fithealth.backend.dto.Review.ReviewCreateDto;
import com.fithealth.backend.dto.Review.ReviewSelectDto;
import com.fithealth.backend.entity.Review;

import java.util.List;

public interface ReviewService {
    Review createReview(ReviewCreateDto.Create reviewCreateDto);
    List<ReviewSelectDto.Select> selectByTrainerNo(Long trainerNo);
}
