package com.fithealth.backend.service;

import com.fithealth.backend.auth.JwtTokenProvider;
import com.fithealth.backend.dto.chat.ChatMessageDto;
import com.fithealth.backend.dto.chat.ChatRoomResponse;
import com.fithealth.backend.entity.*;
import com.fithealth.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ReadStatusRepository readStatusRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public Long getOrCreateRoom(String otherUserEmail) {
        Member member = getCurrentMember();
        System.out.println("내 이메일: " + member.getUserEmail());
        System.out.println("상대방 이메일: " + otherUserEmail);
        if (member.getUserEmail().equals(otherUserEmail)) {
            throw new IllegalArgumentException("자기 자신과는 채팅방을 만들 수 없습니다.");
        }
        Member other = memberRepository.findByUserEmail(otherUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("상대방이 존재하지 않습니다."));

        Optional<ChatRoom> room = chatRoomRepository.findByMember1AndMember2(member, other);
        if (room.isEmpty()) {
            room = chatRoomRepository.findByMember1AndMember2(other, member);
        }

        if (room.isPresent()) return room.get().getId();

        ChatRoom newRoom = ChatRoom.builder()
                .name(member.getUserName() + "_" + other.getUserName())
                .member1(member)
                .member2(other)
                .build();
        chatRoomRepository.save(newRoom);
        return newRoom.getId();
    }

    public List<ChatMessageDto> getChatHistory(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("채팅방이 존재하지 않습니다."));

        Member me = getCurrentMember();
        // 현재 사용자의 읽지 않은 메시지 목록을 미리 조회
        java.util.Set<Long> unreadMessageIds = new java.util.HashSet<>();
        readStatusRepository.findByChatRoomAndMemberAndIsReadFalse(chatRoom, me)
            .forEach(rs -> unreadMessageIds.add(rs.getChatMessage().getId()));

        return chatMessageRepository.findByChatRoomOrderByCreatedTimeAsc(chatRoom).stream()
                .map(c -> ChatMessageDto.builder()
                        .message(c.getContent())
                        .senderEmail(c.getMember().getUserEmail())
                        .roomId(roomId)
                        .createdTime(c.getCreatedTime())
                        .read(!unreadMessageIds.contains(c.getId())) // 읽음 여부
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    public void saveMessage(ChatMessageDto dto) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("채팅방이 존재하지 않습니다."));
        Member sender = memberRepository.findByUserEmail(dto.getSenderEmail())
                .orElseThrow(() -> new EntityNotFoundException("보낸 유저가 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .member(sender)
                .content(dto.getMessage())
                .build();
        chatMessageRepository.save(message);

        List<Member> receivers = List.of(chatRoom.getMember1(), chatRoom.getMember2());
        List<ReadStatus> statuses = receivers.stream()
                .map(m -> ReadStatus.builder()
                        .chatRoom(chatRoom)
                        .chatMessage(message)
                        .member(m)
                        .isRead(m.getUserEmail().equals(sender.getUserEmail()))
                        .build())
                .collect(Collectors.toList());

        readStatusRepository.saveAll(statuses);
    }

    public List<ChatRoomResponse> getMyChatRooms() {
        Member me = getCurrentMember();
        List<ChatRoom> rooms = chatRoomRepository.findAll().stream()
                .filter(r -> me.getUserEmail().equals(r.getMember1().getUserEmail()) ||
                        me.getUserEmail().equals(r.getMember2().getUserEmail()))
                .collect(Collectors.toList());

        return rooms.stream().map(r -> {
            boolean isMeMember1 = me.getUserEmail().equals(r.getMember1().getUserEmail());
            String opponentName = isMeMember1 ? r.getMember2().getUserName() : r.getMember1().getUserName();
            String opponentProfile = isMeMember1 ? r.getMember2().getProfileImage() : r.getMember1().getProfileImage();
            return ChatRoomResponse.builder()
                    .roomId(r.getId())
                    .roomName(opponentName) // 상대방 이름만!
                    .profileImage(opponentProfile) // 상대방 프로필
                    .build();
        }).collect(Collectors.toList());
    }

    public void messageRead(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found"));

        Member member = memberRepository.findByUserEmail(jwtTokenProvider.getUserEmailFromToken())
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        List<ReadStatus> readStatuses = readStatusRepository.findByChatRoomAndMemberAndIsReadFalse(chatRoom, member);
        for (ReadStatus r : readStatuses) {
            r.updateIsRead(true);
        }
    }

    // 카카오톡식 WebSocket 읽음 상태 동기화용 유틸 메서드 추가
    public ChatRoom getChatRoomById(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("채팅방이 존재하지 않습니다."));
    }

    public ChatMessage getLastMessageInRoom(ChatRoom chatRoom) {
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByCreatedTimeAsc(chatRoom);
        if (messages.isEmpty()) throw new jakarta.persistence.EntityNotFoundException("메시지가 없습니다.");
        return messages.get(messages.size() - 1);
    }

    public java.util.Optional<ReadStatus> findReadStatus(ChatRoom chatRoom, Member member, ChatMessage chatMessage) {
        return readStatusRepository.findByChatRoomAndMemberAndChatMessage(chatRoom, member, chatMessage);
    }

    private Member getCurrentMember() {
        String email = jwtTokenProvider.getUserEmailFromToken();
        return memberRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("로그인 유저 없음"));
    }
}