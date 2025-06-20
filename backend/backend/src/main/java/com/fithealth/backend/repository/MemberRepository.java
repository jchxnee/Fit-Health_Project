package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;

import java.util.Optional;

public interface MemberRepository {
    void save(Member member);
    Optional<Member> findOne(String userEmail);
    void updateGradeAndTrainer(String userEmail, CommonEnums.Grade grade, Long trainerNo);
}
