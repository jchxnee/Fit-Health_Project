package com.fithealth.backend.repository;

import com.fithealth.backend.entity.ChatRoom;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.ReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadStatusRepository extends JpaRepository<ReadStatus, Long> {
    Long countByChatRoomAndMemberAndIsReadFalse(ChatRoom chatRoom, Member member);

    List<ReadStatus> findByChatRoomAndMemberAndIsReadFalse(ChatRoom chatRoom, Member member);
}