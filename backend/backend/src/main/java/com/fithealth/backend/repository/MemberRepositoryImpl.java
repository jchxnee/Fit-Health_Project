package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Transactional
@Repository
public class MemberRepositoryImpl implements MemberRepository{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Member member) {
        em.persist(member);
    }

    @Override
    public Optional<Member> findOne(String userEmail) {
        return Optional.ofNullable(em.find(Member.class, userEmail));
    }

}
