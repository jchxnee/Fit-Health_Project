package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;

import java.util.Optional;

public interface MemberRepository {
    void save(Member member);
    Optional<Member> findOne(String userEmail);
    Optional<Member> findOneStatusY(String userEmail, CommonEnums.Status status);
}
