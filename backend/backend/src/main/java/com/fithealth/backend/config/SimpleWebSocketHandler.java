package com.fithealth.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fithealth.backend.auth.JwtTokenProvider;
import com.fithealth.backend.dto.chat.ChatMessageDto;
import com.fithealth.backend.service.ChatService;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SimpleWebSocketHandler extends TextWebSocketHandler {

    private final Map<Long, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    private final ChatService chatService;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public SimpleWebSocketHandler(ChatService chatService, JwtTokenProvider jwtTokenProvider) {
        this.chatService = chatService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("[WebSocket] afterConnectionEstablished 진입");
        String query = session.getUri().getQuery();
        Long roomId = null;
        String token = null;
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("roomId=")) {
                    roomId = Long.parseLong(param.substring(7));
                } else if (param.startsWith("token=")) {
                    token = param.substring(6);
                }
            }
        }

        if (roomId == null || token == null) {
            System.out.println("[WebSocket] roomId 또는 token 누락, 연결 종료");
            session.close();
            return;
        }
        try {
            jwtTokenProvider.parseClaims(token);
            String email = jwtTokenProvider.parseClaims(token).getSubject();
            session.getAttributes().put("userEmail", email);
            System.out.println("[WebSocket] JWT 인증 성공, userEmail=" + email);
        } catch (Exception e) {
            System.out.println("[WebSocket] JWT 인증 실패: " + e.getMessage());
            e.printStackTrace();
            session.close();
            return;
        }

        session.getAttributes().put("roomId", roomId);
        roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        System.out.println("[WebSocket] 연결 성공: sessionId=" + session.getId() + ", roomId=" + roomId);
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("[WebSocket] handleTextMessage 진입");
        String payload = message.getPayload();
        System.out.println("[WebSocket] 수신 메시지: " + payload);
        ChatMessageDto chatMessageDto = objectMapper.readValue(payload, ChatMessageDto.class);

        // senderEmail을 session에서 꺼내서 dto에 set
        String email = (String) session.getAttributes().get("userEmail");
        chatMessageDto.setSenderEmail(email);

        chatService.saveMessage(chatMessageDto);

        // 저장된 ChatMessage, ChatRoom, Member 조회
        Long roomId = chatMessageDto.getRoomId();
        String senderEmail = chatMessageDto.getSenderEmail();
        com.fithealth.backend.entity.ChatRoom chatRoom = chatService.getChatRoomById(roomId);
        com.fithealth.backend.entity.Member member1 = chatRoom.getMember1();
        com.fithealth.backend.entity.Member member2 = chatRoom.getMember2();
        com.fithealth.backend.entity.ChatMessage chatMessage = chatService.getLastMessageInRoom(chatRoom); // 방금 저장된 메시지

        Set<WebSocketSession> targetSessions = roomSessions.get(roomId);
        if (targetSessions != null) {
            for (WebSocketSession s : targetSessions) {
                String sessionEmail = (String) s.getAttributes().get("userEmail");
                boolean isMe = senderEmail.equals(sessionEmail);
                boolean read = true;
                if (isMe) {
                    // 내가 보낸 메시지 → 상대방의 ReadStatus를 조회
                    String opponentEmail = member1.getUserEmail().equals(senderEmail) ? member2.getUserEmail() : member1.getUserEmail();
                    com.fithealth.backend.entity.Member opponent = member1.getUserEmail().equals(senderEmail) ? member2 : member1;
                    java.util.Optional<com.fithealth.backend.entity.ReadStatus> rsOpt = chatService.findReadStatus(chatRoom, opponent, chatMessage);
                    read = rsOpt.isPresent() && rsOpt.get().getIsRead();
                }
                // 상대방이 보낸 메시지는 항상 read: true
                chatMessageDto.setRead(read);
                String sendPayload = objectMapper.writeValueAsString(chatMessageDto);
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(sendPayload));
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("[WebSocket] afterConnectionClosed 진입");
        Long roomId = (Long) session.getAttributes().get("roomId");
        if (roomId != null) {
            Set<WebSocketSession> sessions = roomSessions.get(roomId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    roomSessions.remove(roomId);
                }
            }
        }
        System.out.println("[WebSocket] 연결 종료: sessionId=" + session.getId() + ", 상태=" + status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("[WebSocket] handleTransportError 진입");
        System.out.println("[WebSocket] 에러: " + exception.getMessage());
        exception.printStackTrace();
    }
}