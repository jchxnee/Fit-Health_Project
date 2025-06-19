package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
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

    @Override
    public Optional<Member> findByTrainerNo(Long trainerNo) {
        return Optional.ofNullable(em.find(Member.class, trainerNo));
    }

    @Override
    public Optional<Member> findByUserEmail(String userEmail) {
        try {
            return Optional.ofNullable(em.find(Member.class, userEmail));
        } catch (NoResultException e) {
            // 결과가 없을 경우
            return Optional.empty();
        } catch (Exception e) {
            // 다른 예외 처리 (예: NonUniqueResultException 등)
            System.err.println("이메일로 찾을 수 없는 멤버입니다." + e.getMessage());
            return Optional.empty();
        }
    }
    }


