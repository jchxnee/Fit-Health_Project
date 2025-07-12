package com.fithealth.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public SimpleWebSocketHandler(ChatService chatService, JwtTokenProvider jwtTokenProvider) {
        this.chatService = chatService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
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
            session.close();
            return;
        }
        try {
            jwtTokenProvider.parseClaims(token);
            System.out.println("WebSocket JWT 인증 성공");
        } catch (Exception e) {
            System.out.println("WebSocket JWT 인증 실패: " + e.getMessage());
            e.printStackTrace();
            session.close();
            return;

        }

        session.getAttributes().put("roomId", roomId);
        roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        System.out.println("Connected : " + session.getId() + " to room " + roomId);
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("received message : " + payload);
        ChatMessageDto chatMessageDto = objectMapper.readValue(payload, ChatMessageDto.class);

        chatService.saveMessage(chatMessageDto);

        Long roomId = chatMessageDto.getRoomId();
        Set<WebSocketSession> targetSessions = roomSessions.get(roomId);
        if (targetSessions != null) {
            for (WebSocketSession s : targetSessions) {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(payload));
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
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
        System.out.println("disconnected!!");
    }
}