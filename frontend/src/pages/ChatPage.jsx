import React, { useState, useEffect, useRef } from 'react';
import { FiPaperclip, FiCamera, FiSmile } from 'react-icons/fi';
import { MdSend } from 'react-icons/md';
import styled from 'styled-components';
import TitleBar from '../components/TitleBar';
import {
  getMyChatRooms,
  getChatHistory,
  readChatRoom,
} from '../api/chatApi.js'; // 실제 API 경로에 맞게 수정 필요

const WS_BASE_URL = 'ws://localhost:8080/connect'; // 실제 서버 주소에 맞게 수정

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [activeChatId, setActiveChatId] = useState(null); // 현재 활성화된 채팅방
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing', 'completed'
  const wsRef = useRef(null);
  const scrollRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');

  // access token 가져오기 (localStorage 기준)
  const getToken = () => localStorage.getItem('accessToken');

  // 내 정보(이메일) 가져오기 (토큰 decode 또는 별도 API 필요)
  useEffect(() => {
    // 예시: localStorage에 email 저장되어 있다고 가정
    setUserEmail(localStorage.getItem('userEmail') || '');
  }, []);

  // 채팅방 목록 불러오기
  useEffect(() => {
    getMyChatRooms()
      .then((data) => {
        setChatRooms(data);
        if (data.length > 0 && !activeChatId) {
          setActiveChatId(String(data[0].roomId));
        }
      })
      .catch((e) => {
        setChatRooms([]);
      });
  }, []);

  // 채팅방 변경 시 메시지 불러오기 및 읽음 처리
  useEffect(() => {
    if (!activeChatId) return;
    getChatHistory(activeChatId)
      .then((data) => {
        setMessages(
          data.map((msg, idx) => ({
            id: `m${idx}_${msg.senderEmail}`,
            text: msg.message,
            time: '', // 시간 포맷 필요시 추가
            isSent: msg.senderEmail === userEmail,
            read: true, // 읽음 여부는 별도 처리 필요
          }))
        );
        // 읽음 처리
        readChatRoom(activeChatId);
      })
      .catch(() => setMessages([]));
    // WebSocket 연결
    connectWebSocket(activeChatId);
    // eslint-disable-next-line
  }, [activeChatId, userEmail]);

  // WebSocket 연결 및 메시지 수신 처리
  const connectWebSocket = (roomId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    const token = getToken();
    if (!token) return;
    const ws = new window.WebSocket(`${WS_BASE_URL}?roomId=${roomId}&token=${token}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          {
            id: `m${Date.now()}`,
            text: msg.message,
            time: '',
            isSent: msg.senderEmail === userEmail,
            read: true,
          },
        ]);
      } catch (e) {}
    };
    ws.onclose = () => {};
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !wsRef.current || wsRef.current.readyState !== 1) return;
    const msgObj = {
      roomId: Number(activeChatId),
      message: messageInput,
      senderEmail: userEmail,
    };
    wsRef.current.send(JSON.stringify(msgObj));
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        text: messageInput,
        time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }),
        isSent: true,
        read: false,
      },
    ]);
    setMessageInput('');
  };

  // 탭에 따라 채팅방 필터링
  const filteredChatRooms = chatRooms.filter((room) => {
    if (activeTab === 'all') {
      return true;
    }
    // ongoing/completed 구분은 roomName이나 별도 필드 필요
    return true; // 임시로 모두 표시
  });

  const activeChatRoom = chatRooms.find((chat) => String(chat.roomId) === String(activeChatId));

  // 메시지 스크롤이 가장 아래로 내려갈 때 메시지를 읽음 처리
  const handleScrollToBottom = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.isSent === false && message.read === false ? { ...message, read: true } : message
        )
      );
    }
  };

  // 채팅방 변경 시 WebSocket 재연결
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [activeChatId]);

  return (
    <>
      <ChatPageContainer>
        <TitleBar title="1:1 채팅" />

        <ChatContentBox>
          {/* 왼쪽 채팅 목록 섹션 */}
          <ChatListSection>
            <ChatTabContainer>
              <ChatTab $isActive={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')}>
                진행중
              </ChatTab>
              <ChatTab $isActive={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                종료됨
              </ChatTab>
            </ChatTabContainer>
            <ChatListScrollContainer>
              {filteredChatRooms.map((room) => (
                <ChatListItem
                  key={room.roomId}
                  $isActive={String(room.roomId) === String(activeChatId)}
                  onClick={() => setActiveChatId(String(room.roomId))}
                >
                  <ChatAvatar>{room.roomName ? room.roomName.charAt(0) : '?'}</ChatAvatar>
                  <ChatInfo>
                    <ChatName>{room.roomName}</ChatName>
                    <LastMessage>{room.lastMessage || ''}</LastMessage>
                  </ChatInfo>
                  <LastMessageTime>{room.time || ''}</LastMessageTime>
                </ChatListItem>
              ))}
            </ChatListScrollContainer>
          </ChatListSection>

          {/* 오른쪽 채팅창 섹션 */}
          <ChatWindowSection>
            <ChatWindowHeader>
              <ChatWindowName>{activeChatRoom ? activeChatRoom.roomName : '채팅방 선택'}</ChatWindowName>
              {activeChatRoom && (
                <ChatStatus $isOngoing={true}>
                  진행중
                </ChatStatus>
              )}
            </ChatWindowHeader>

            <ChatMessagesContainer onScroll={handleScrollToBottom} ref={scrollRef}>
              {messages.map((message) => (
                <MessageWrapper key={message.id} $isSent={message.isSent}>
                  {message.isSent ? (
                    <>
                      {!message.read && <UnreadIndicator>1</UnreadIndicator>}
                      <MessageTime $isSent={true}>{message.time}</MessageTime>
                      <SentMessageBubble>{message.text}</SentMessageBubble>
                    </>
                  ) : (
                    <>
                      <ReceivedMessageBubble>{message.text}</ReceivedMessageBubble>
                      <MessageTime $isSent={false}>{message.time}</MessageTime>
                    </>
                  )}
                </MessageWrapper>
              ))}
            </ChatMessagesContainer>
            <ChatInputArea>
              <InputIcons>
                <FiPaperclip title="파일 첨부" />
                <FiCamera title="사진 첨부" />
                <FiSmile title="이모티콘" />
              </InputIcons>
              <InputField
                placeholder="메시지를 입력해주세요..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <SendButton onClick={handleSendMessage} disabled={!messageInput.trim()}>
                <MdSend size={24} />
              </SendButton>
            </ChatInputArea>
          </ChatWindowSection>
        </ChatContentBox>
      </ChatPageContainer>
    </>
  );
};

export default ChatPage;

// 메인 채팅 컨테이너
const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 120px); /* 헤더/푸터를 제외한 높이 (대략적인 값, 실제 높이에 따라 조절) */
  box-sizing: border-box;
`;

// 채팅 내용이 들어갈 메인 박스 (max-width 적용)
const ChatContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  width: 100%;
  max-width: ${({ theme }) => theme.width.lg}; /* 1008px */
  margin-top: ${({ theme }) => theme.spacing[8]};
  display: flex;
  height: 700px; /* 고정 높이 또는 min-height로 조절 */
  overflow: hidden; /* 내부 스크롤을 위해 */
`;

// 왼쪽 채팅 목록 섹션
const ChatListSection = styled.div`
  flex: 0 0 250px; /* 고정 너비 */
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 배경색 */
`;

const ChatTabContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ChatTab = styled.button`
  flex: 1;
  padding: 14px;
  background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : theme.colors.gray[50])};
  border: none;
  border-bottom: ${({ $isActive, theme }) => ($isActive ? `2px solid ${theme.colors.button}` : 'none')};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ $isActive, theme }) => ($isActive ? theme.fontWeights.semibold : theme.fontWeights.medium)};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.button : theme.colors.primary)};
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

// 채팅 목록 (스크롤 가능)
const ChatListScrollContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

// 개별 채팅방 아이템
const ChatListItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
  background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.gray[300]}; /* 아바타 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.white};
  margin-right: ${({ theme }) => theme.spacing[2]};
  overflow: hidden; /* 이미지 오버플로우 방지 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ChatInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const LastMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const LastMessageTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-left: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

// 오른쪽 채팅 내용 섹션
const ChatWindowSection = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

const ChatWindowHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatWindowName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const ChatStatus = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ $isOngoing, theme }) =>
    $isOngoing ? theme.colors.success : theme.colors.gray[400]}; /* 진행중이면 초록, 완료면 회색 */
  color: ${({ theme }) => theme.colors.white};
`;

// 메시지 표시 영역
const ChatMessagesContainer = styled.div`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing[4]};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  word-wrap: break-word;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
`;

const SentMessageBubble = styled(MessageBubble)`
  background-color: #e0f7fa;
  align-self: flex-end; /* 오른쪽 정렬 */
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.sm}; /* 꼬리 부분 */
`;

const ReceivedMessageBubble = styled(MessageBubble)`
  background-color: ${({ theme }) => theme.colors.gray[200]}; /* 연한 회색 */
  align-self: flex-start; /* 왼쪽 정렬 */
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.sm}; /* 꼬리 부분 */
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0 ${({ theme }) => theme.spacing[1]};
  text-align: ${({ $isSent }) => ($isSent ? 'right' : 'left')};
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-end; /* 버블과 시간을 아래쪽으로 정렬 */
  margin-bottom: ${({ theme }) => theme.spacing[2]}; /* 각 메시지 그룹 간 간격 */

  ${({ $isSent }) =>
    $isSent
      ? `
    justify-content: flex-end; /* 보낸 메시지는 오른쪽 정렬 */
    ${MessageBubble} {
      margin-right: ${({ theme }) => theme.spacing[1]}; /* 버블과 시간 사이 간격 */
    }
  `
      : `
    justify-content: flex-start; /* 받은 메시지는 왼쪽 정렬 */
    ${MessageBubble} {
      margin-left: ${({ theme }) => theme.spacing[1]}; /* 버블과 시간 사이 간격 */
    }
  `}
`;

// 안읽음 표시 '1' 스타일
const UnreadIndicator = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.success}; /* 읽지 않은 메시지 표시 색상 (예: 초록색) */
  margin-right: 4px; /* 시간과 '1' 사이 간격 */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

// 메시지 입력 영역
const ChatInputArea = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
`;

const InputField = styled.textarea`
  flex-grow: 1;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  resize: none; /* 사용자 크기 조절 방지 */
  margin-right: ${({ theme }) => theme.spacing[2]};
  outline: none;
  color: ${({ theme }) => theme.colors.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.button}; /* 버튼 색상 */
  color: ${({ theme }) => theme.colors.white};
  border: none;
  outline: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #153c82; /* hover 색상 */
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const InputIcons = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing[2]};

  svg {
    font-size: ${({ theme }) => theme.fontSizes['xl']};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: pointer;
    margin-right: ${({ theme }) => theme.spacing[1]};

    &:last-child {
      margin-right: 0;
    }
  }
`;
