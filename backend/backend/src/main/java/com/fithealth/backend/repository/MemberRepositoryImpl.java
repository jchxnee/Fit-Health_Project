package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
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
    public Optional<Member> findOneStatusY(String userEmail, CommonEnums.Status status) {
        String sql = "SELECT m FROM Member m WHERE m.userEmail = :userEmail AND m.status = :status";
        try {
            Member member = em.createQuery(sql, Member.class)
                    .setParameter("userEmail", userEmail)
                    .setParameter("status", status)
                    .getSingleResult();
            return Optional.of(member);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

}
