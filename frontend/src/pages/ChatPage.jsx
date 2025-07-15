import React, { useState, useEffect, useRef } from 'react';
import { FiPaperclip, FiCamera, FiSmile } from 'react-icons/fi';
import { MdSend } from 'react-icons/md';
import styled from 'styled-components';
import TitleBar from '../components/TitleBar';
import {
  getMyChatRooms,
  getChatHistory,
  readChatRoom,
} from '../api/chatApi.js';
// import basicProfile from 'E:\Fit-Health_Project\frontend\public\img\basicProfile.jpg'; // import 구문 제거

const WS_BASE_URL = 'ws://localhost:7961/connect'; // 백엔드 서버 포트로 수정
const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

// 시간 포맷 함수 추가
const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${ampm} ${displayHour}:${minutes}`;
};

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeChatId, setActiveChatId] = useState(null); // 현재 활성화된 채팅방
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing', 'completed'
  const wsRef = useRef(null);
  const scrollRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');

  // access token 가져오기 (localStorage 기준)
  const getToken = () => sessionStorage.getItem('token');

  // 내 정보(이메일) 가져오기 (토큰 decode 또는 별도 API 필요)
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || '';
    setUserEmail(email);
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
    getChatHistory(activeChatId).then((data) => {
      const formatted = data.map((msg, idx) => ({
        id: `m${idx}_${msg.senderEmail}`,
        text: msg.message,
        time: formatTime(msg.createdTime), // 시간 포맷 적용
        isSent: (msg.senderEmail || '').toLowerCase() === (userEmail || '').toLowerCase(),
        read: msg.read || false
      }));
      setMessages(formatted);

      // 읽지 않은 메시지 수 0으로 초기화
      setUnreadCounts((prev) => ({ ...prev, [activeChatId]: 0 }));

      connectWebSocket(activeChatId);
    });
  }, [activeChatId, userEmail]);



  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);


  // WebSocket 연결 및 메시지 수신 처리
  const connectWebSocket = (roomId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    const token = getToken();
    if (!token) {
      console.error('토큰이 없습니다.');
      return;
    }
    console.log('roomId:', roomId, 'token:', token);
    const wsUrl = `${WS_BASE_URL}?roomId=${roomId}&token=${token}`;
    console.log('WebSocket 연결 시도:', wsUrl);
    const ws = new window.WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log('WebSocket 연결 성공');
    };
    ws.onerror = (e) => {
      console.error('WebSocket 에러:', e);
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const isMe = (msg.senderEmail || '').trim().toLowerCase() === (userEmail || '').trim().toLowerCase();
        const isActiveRoom = String(msg.roomId) === String(activeChatId);
        const newMsg = {
          id: `m${Date.now()}`,
          text: msg.message,
          time: formatTime(msg.createdTime || new Date()), // createdTime 없으면 현재 시각 사용
          isSent: isMe,
          read: isMe // 본인이 보낸 건 바로 읽음
        };
        setMessages((prev) => [...prev, newMsg]);

        // 읽지 않은 메시지 수 증가: 현재 활성화된 채팅방이 아닐 때만
        if (!isMe && !isActiveRoom) {
          setUnreadCounts((prev) => {
            const prevCount = prev[msg.roomId] || 0;
            return { ...prev, [msg.roomId]: prevCount + 1 };
          });
        }
      } catch (e) {
        console.error('메시지 파싱 오류', e);
      }
    };

    ws.onclose = (e) => {
      console.log('WebSocket 연결 종료', e);
    };
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !wsRef.current || wsRef.current.readyState !== 1) return;
    const msgObj = {
      roomId: Number(activeChatId),
      message: messageInput,
    };
    wsRef.current.send(JSON.stringify(msgObj));
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
  const handleScrollToBottom = async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setMessages((prevMessages) =>
        prevMessages.map((m) => (!m.read && !m.isSent ? { ...m, read: true } : m))
      );

      setUnreadCounts((prev) => ({ ...prev, [activeChatId]: 0 }));

      try {
        await readChatRoom(activeChatId);
      } catch (e) {
        console.error('읽음 처리 실패', e);
      }
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
              {filteredChatRooms.map((room) => {
                const unread = unreadCounts[room.roomId] || 0;
                return (
                  <ChatListItem
                    key={room.roomId}
                    $isActive={String(room.roomId) === String(activeChatId)}
                    onClick={() => setActiveChatId(String(room.roomId))}
                  >
                    <ChatAvatar>
                      <img
                        src={room.profileImage ? CLOUDFRONT_URL + room.profileImage : '/img/basicProfile.jpg'}
                        alt="프로필"
                      />
                    </ChatAvatar>
                    <ChatInfo>
                      <ChatName>{room.roomName}</ChatName>
                      <LastMessage>{room.lastMessage || ''}</LastMessage>
                    </ChatInfo>
                    {unread > 0 && <UnreadBadge>{unread}</UnreadBadge>}
                  </ChatListItem>
                );
              })}

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

// ========== 스타일 컴포넌트 ==========

// 메인 채팅 컨테이너
const ChatPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: calc(100vh - 120px);
    box-sizing: border-box;
`;

// 채팅 내용이 들어갈 메인 박스
const ChatContentBox = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius.base};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    width: 100%;
    max-width: ${({ theme }) => theme.width.lg};
    margin-top: ${({ theme }) => theme.spacing[8]};
    display: flex;
    height: 700px;
    overflow: hidden;
`;

// 왼쪽 채팅 목록 섹션
const ChatListSection = styled.div`
    flex: 0 0 250px;
    border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.gray[100]};
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

const ChatListScrollContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
`;

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
    background-color: ${({ theme }) => theme.colors.gray[300]};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.white};
    margin-right: ${({ theme }) => theme.spacing[2]};
    overflow: hidden;

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
    margin-top: 10px;
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
            $isOngoing ? theme.colors.success : theme.colors.gray[400]};
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

// 수정된 부분: 메시지 정렬 문제 해결
const MessageWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing[2]};

    /* 핵심 수정: 조건부 정렬 */
    justify-content: ${({ $isSent }) => ($isSent ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = styled.div`
    max-width: 70%;
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    word-wrap: break-word;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.primary};
`;

// 수정된 부분: align-self 제거
const SentMessageBubble = styled(MessageBubble)`
    background-color: #e0f7fa;
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ReceivedMessageBubble = styled(MessageBubble)`
    background-color: ${({ theme }) => theme.colors.gray[200]};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MessageTime = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.gray[500]};
    margin: 0 ${({ theme }) => theme.spacing[1]};
    display: flex;
    align-items: flex-end;
`;

const UnreadIndicator = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.success};
  margin-right: 4px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: flex;
  align-items: flex-end;
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
  resize: none;
  margin-right: ${({ theme }) => theme.spacing[2]};
  outline: none;
  color: ${({ theme }) => theme.colors.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SendButton = styled.button`
    background-color: ${({ theme }) => theme.colors.button};
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
        background-color: #153c82;
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

const UnreadBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.danger || '#f44336'};
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 8px;
  margin-left: auto;
`;