package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;

import com.fithealth.backend.enums.SocialType;
import java.util.List;
import java.util.Optional;

public interface MemberRepository {
    void save(Member member);
    Optional<Member> findOne(String userEmail);
    Optional<Member> findByNameAndPhone(String name, String phone);
    Optional<Member> findBySocialIdAndSocialType(String socialId, SocialType socialType);
    Optional<Member> findByTrainerNo(Long trainerNo);
    Optional<Member> findByUserEmail(String userEmail);
    void updateGradeAndTrainer(String userEmail, CommonEnums.Grade grade, Long trainerNo);
    List<Member> findTrainer();
    Optional<Member> findOneStatusY(String userEmail, CommonEnums.Status status);
    boolean findByNameAndEmail(String userName, String userEmail);
    SocialType isSocialMember(String userEmail);
}
