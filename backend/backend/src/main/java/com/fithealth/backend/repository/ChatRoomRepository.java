package com.fithealth.backend.repository;

import com.fithealth.backend.entity.ChatRoom;
import com.fithealth.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByMember1AndMember2(Member member1, Member member2);
    Optional<ChatRoom> findByMember2AndMember1(Member member2, Member member1);
}

