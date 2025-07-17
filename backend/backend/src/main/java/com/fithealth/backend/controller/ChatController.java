package com.fithealth.backend.controller;

import com.fithealth.backend.dto.chat.ChatMessageDto;
import com.fithealth.backend.dto.chat.MyChatResponse;
import com.fithealth.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.fithealth.backend.dto.chat.ChatRoomResponse;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/room")
    public ResponseEntity<?> getOrCreateRoom(@RequestParam("otherMemberEmail") String otherMemberEmail) {
        Long roomId = chatService.getOrCreateRoom(otherMemberEmail);
        return ResponseEntity.ok(roomId); // roomId 반환
    }

    //특정 채팅방의 이전 메세지 목록 조회
    @GetMapping("/history/{roomId}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long roomId) {
        List<ChatMessageDto> chatMessageDtos = chatService.getChatHistory(roomId);
        return new ResponseEntity<>(chatMessageDtos, HttpStatus.OK);
    }

    //내 채팅방 목록 조회 : roomId, roomName, 그룹채팅여부, 메세지 읽을 개수
    @GetMapping("/my/rooms")
    public ResponseEntity<?> getMyRooms() {
        List<ChatRoomResponse> myChatResponses = chatService.getMyChatRooms();
        return new ResponseEntity<>(myChatResponses, HttpStatus.OK);
    }

    //채팅메세지 읽음 처리
    @PostMapping("/room/{roomId}/read")
    public ResponseEntity<?> readRoom(@PathVariable Long roomId) {
        chatService.messageRead(roomId);
        return ResponseEntity.ok().build();
    }
}
