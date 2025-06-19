package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;

import java.util.Optional;

public interface MemberRepository {
    void save(Member member);
    Optional<Member> findOne(String userEmail);
    Optional<Member> findByTrainerNo(Long trainerNo);
    Optional<Member> findByUserEmail(String userEmail);
}
