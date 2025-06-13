import React, { useState } from 'react';
import { FiPaperclip, FiCamera, FiSmile } from 'react-icons/fi';
import { MdSend } from 'react-icons/md';
import styled from 'styled-components';

const ChatPage = () => {
  // 예시 데이터 (실제로는 API에서 가져옴)
  const chatRooms = [
    {
      id: '1',
      name: '김요가 님',
      lastMessage: '잘 부탁드립니다!',
      time: '10분',
      avatar: 'https://via.placeholder.com/40', // 또는 첫 글자
      status: 'ongoing', // 'ongoing' 또는 'completed'
    },
    {
      id: '2',
      name: '박코치 님',
      lastMessage: '2452',
      time: '3시간',
      avatar: null, // 아바타 없음
      status: 'completed',
    },
    {
      id: '3',
      name: '전찬영 님',
      lastMessage: '헬스는?',
      time: '7일',
      avatar: null,
      status: 'ongoing',
    },
    {
      id: '4',
      name: '고객센터',
      lastMessage: '문의 요청 드립니다.',
      time: '10일',
      avatar: null,
      status: 'ongoing',
    },
    // ... 추가 채팅방
  ];

  const messages = [
    {
      id: 'm1',
      text: '안녕하세요.',
      time: '오후 3:33',
      isSent: false, // 받은 메시지
    },
    {
      id: 'm2',
      text: '안녕하세요.',
      time: '오후 3:33',
      isSent: true, // 보낸 메시지
    },
    {
      id: 'm3',
      text: '잘 부탁드립니다!',
      time: '오후 3:33',
      isSent: true,
    },
    // ... 추가 메시지
  ];

  const [activeChatId, setActiveChatId] = useState('1'); // 현재 활성화된 채팅방
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing', 'completed'

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    // 메시지 전송 로직 (예: API 호출, messages 배열 업데이트)
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  // 탭에 따라 채팅방 필터링
  const filteredChatRooms = chatRooms.filter((room) => {
    if (activeTab === 'all') {
      return true;
    }
    return room.status === activeTab;
  });

  const activeChatRoom = chatRooms.find((chat) => chat.id === activeChatId);

  return (
    <ChatPageContainer>
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
              <ChatListItem key={room.id} $isActive={room.id === activeChatId} onClick={() => setActiveChatId(room.id)}>
                <ChatAvatar>{room.avatar ? <img src={room.avatar} alt="아바타" /> : room.name.charAt(0)}</ChatAvatar>
                <ChatInfo>
                  <ChatName>{room.name}</ChatName>
                  <LastMessage>{room.lastMessage}</LastMessage>
                </ChatInfo>
                <LastMessageTime>{room.time}</LastMessageTime>
              </ChatListItem>
            ))}
          </ChatListScrollContainer>
        </ChatListSection>

        {/* 오른쪽 채팅창 섹션 */}
        <ChatWindowSection>
          <ChatWindowHeader>
            <ChatWindowName>{activeChatRoom ? activeChatRoom.name : '채팅방 선택'}</ChatWindowName>
            {activeChatRoom && (
              <ChatStatus $isOngoing={activeChatRoom.status === 'ongoing'}>
                {activeChatRoom.status === 'ongoing' ? '진행중' : '완료됨'}
              </ChatStatus>
            )}
          </ChatWindowHeader>

          <ChatMessagesContainer>
            {messages.map((message) => (
              <MessageWrapper key={message.id} $isSent={message.isSent}>
                {message.isSent ? (
                  <>
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
            </InputIcons>
            <InputField
              placeholder="메시지를 입력해주세요..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  // Shift+Enter는 줄바꿈, Enter만은 전송
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <SendButton onClick={handleSendMessage} disabled={!messageInput.trim()}>
              <MdSend size={24} /> {/* 전송 아이콘 */}
            </SendButton>
          </ChatInputArea>
        </ChatWindowSection>
      </ChatContentBox>
    </ChatPageContainer>
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
  padding: ${({ theme }) => theme.spacing[8]} 0;
  box-sizing: border-box;
`;

// 채팅 내용이 들어갈 메인 박스 (max-width 적용)
const ChatContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  width: 100%;
  max-width: ${({ theme }) => theme.width.lg}; /* 1008px */
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
