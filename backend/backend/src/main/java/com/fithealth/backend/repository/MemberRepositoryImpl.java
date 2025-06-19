package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
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
        em.merge(member);
    }

    @Override
    public Optional<Member> findOne(String userEmail) {
        return Optional.ofNullable(em.find(Member.class, userEmail));
    }

    @Override
    public void updateGradeAndTrainer(String userEmail, CommonEnums.Grade grade, Long trainerNo) {
        em.createQuery("UPDATE Member m SET m.grade = :grade, m.trainer.trainerNo = :trainerNo WHERE m.userEmail = :userEmail")
                .setParameter("grade", grade)
                .setParameter("trainerNo", trainerNo)
                .setParameter("userEmail", userEmail)
                .executeUpdate();
        em.flush();
    }
}
