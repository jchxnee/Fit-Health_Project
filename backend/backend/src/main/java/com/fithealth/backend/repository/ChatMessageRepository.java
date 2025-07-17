package com.fithealth.backend.repository;

import com.fithealth.backend.entity.ChatMessage;
import com.fithealth.backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderByCreatedTimeAsc(ChatRoom chatRoom);
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
            "WHERE cm.chatRoom = :chatRoom " +
            "AND cm.member.userEmail <> :memberEmail " +
            "AND NOT EXISTS (SELECT rs FROM ReadStatus rs " +
            "                WHERE rs.chatMessage = cm " +
            "                AND rs.member.userEmail = :memberEmail " +
            "                AND rs.isRead = true)")
    Long countUnreadMessagesForMember(@Param("chatRoom") ChatRoom chatRoom, @Param("memberEmail") String memberEmail);
}
