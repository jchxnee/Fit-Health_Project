package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;

import java.util.Optional;

public interface MemberRepository {
    void save(Member member);
    Optional<Member> findOne(String userEmail);
}
