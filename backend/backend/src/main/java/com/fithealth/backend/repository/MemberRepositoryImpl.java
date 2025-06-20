package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException; // NoResultException은 JPQL getSingleResult()에서 사용
import jakarta.persistence.TypedQuery; // TypedQuery 임포트 추가
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List; // List 임포트 추가 (쿼리 결과가 여러 개일 수 있으므로)
import java.util.Optional;

@Transactional
@Repository
public class MemberRepositoryImpl implements MemberRepository { // 올바른 클래스 시작

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

    @Override
    public List<Member> findTrainer() {
        // GRADE가 'C' (코치)인 멤버들을 조회합니다.
        // Member와 Trainer를 LEFT JOIN FETCH 하여 N+1 문제 방지
        TypedQuery<Member> query = em.createQuery(
                "SELECT m FROM Member m LEFT JOIN FETCH m.trainer t WHERE m.grade = :grade", Member.class);
        query.setParameter("grade", CommonEnums.Grade.C);
        return query.getResultList();
    }


    @Override
    public Optional<Member> findByTrainerNo(Long trainerNo) {
        try {
            // JPQL 쿼리 사용: Member 엔티티에서 trainerNo 필드가 일치하는 멤버를 찾습니다.
            // 결과가 0개 또는 1개일 것으로 예상되는 경우 getSingleResult()를 사용합니다.
            // 여러 개의 Member가 한 trainerNo를 가질 수도 있다면 getResultList()를 사용해야 합니다.
            TypedQuery<Member> query = em.createQuery(
                    "SELECT m FROM Member m WHERE m.trainer.trainerNo = :trainerNo", Member.class);
            query.setParameter("trainerNo", trainerNo);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            // 결과가 없는 경우 Optional.empty() 반환
            return Optional.empty();
        } catch (Exception e) {
            // 다른 예외 처리 (예: NonUniqueResultException 등)
            System.err.println("트레이너 번호로 멤버를 찾을 수 없습니다: " + e.getMessage());
            return Optional.empty();
        }
    }

    // findByUserEmail은 기존 findOne과 동일한 기능을 합니다.
    // 만약 userEmail이 PK가 아니라 다른 고유한 필드라면 이 방법을 사용하는 것이 더 명확합니다.
    // 하지만 이미 findOne에서 PK로 사용 중이므로, 이 메서드는 중복이거나
    // userEmail이 PK가 아니라는 가정 하에 작성됩니다.
    @Override
    public Optional<Member> findByUserEmail(String userEmail) {
        try {
            // JPQL 쿼리 사용: Member 엔티티에서 userEmail 필드가 일치하는 멤버를 찾습니다.
            TypedQuery<Member> query = em.createQuery(
                    "SELECT m FROM Member m WHERE m.userEmail = :userEmail", Member.class);
            query.setParameter("userEmail", userEmail);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            // 결과가 없는 경우 Optional.empty() 반환
            return Optional.empty();
        } catch (Exception e) {
            // 다른 예외 처리 (예: NonUniqueResultException 등)
            System.err.println("이메일로 멤버를 찾을 수 없습니다: " + e.getMessage());
            return Optional.empty();
        }
    }
}