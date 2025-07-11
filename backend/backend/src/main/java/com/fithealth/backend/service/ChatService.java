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

        Member member = getCurrentMember();
        boolean isParticipant =
                member.getUserEmail().equals(chatRoom.getMember1().getUserEmail()) ||
                        member.getUserEmail().equals(chatRoom.getMember2().getUserEmail());

        if (!isParticipant) throw new IllegalArgumentException("해당 채팅방에 참여하고 있지 않습니다.");

        return chatMessageRepository.findByChatRoomOrderByCreatedTimeAsc(chatRoom).stream()
                .map(c -> ChatMessageDto.builder()
                        .message(c.getContent())
                        .senderEmail(c.getMember().getUserEmail())
                        .roomId(roomId)
                        .build())
                .collect(Collectors.toList());
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
            long unRead = readStatusRepository.countByChatRoomAndMemberAndIsReadFalse(r, me);
            return ChatRoomResponse.builder()
                    .roomId(r.getId())
                    .roomName(r.getName())
                    .build();
        }).collect(Collectors.toList());
    }

    public void messageRead(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("채팅방이 없습니다."));

        Member member = getCurrentMember();
        List<ReadStatus> unread = readStatusRepository.findByChatRoomAndMemberAndIsReadFalse(chatRoom, member);
        unread.forEach(rs -> rs.updateIsRead(true));
    }

    private Member getCurrentMember() {
        String email = jwtTokenProvider.getUserEmailFromToken();
        return memberRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("로그인 유저 없음"));
    }
}