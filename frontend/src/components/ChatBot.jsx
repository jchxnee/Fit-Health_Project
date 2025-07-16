import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { TbMessageChatbot } from 'react-icons/tb';
import { RiRobot2Line } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import api from '../api/axios';
import { PulseLoader } from 'react-spinners';

const ChatBotWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 9999;
`;

const ToggleButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatWindow = styled.div`
  width: 350px;
  height: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  padding: 0;
  position: absolute;
  bottom: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background-color: #4a90e2;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ChatBubble = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: ${({ isUser }) => (isUser ? '#4a90e2' : '#f1f1f1')};
  color: ${({ isUser }) => (isUser ? 'white' : 'black')};
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  white-space: pre-wrap;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const SendButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 모달 영역 ref
  const chatWindowRef = useRef(null);

  // 2. 메시지 컨테이너 ref (스크롤 조작용)
  const messagesEndRef = useRef(null);

  // 외부 클릭 시 모달 닫기 처리
  useEffect(() => {
    function handleClickOutside(event) {
      if (open && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        setOpen(false);
        setMessages([]);
        setQuestion('');
        setIsLoading(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // 메시지 변경 시 자동 스크롤 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    if (open) {
      setMessages([]);
      setQuestion('');
      setIsLoading(false);
    }
    setOpen(!open);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setMessages((prev) => [...prev, { type: 'bot', text: '', loading: true }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/chatbot/ask', { question });
      const data = res.data;

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.findIndex((msg) => msg.loading);
        if (lastIndex !== -1) {
          newMessages[lastIndex] = {
            type: 'bot',
            text: data.status === 'success' ? data.answer : data.error || '오류가 발생했습니다.',
            loading: false,
          };
        }
        return newMessages;
      });
    } catch (err) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.findIndex((msg) => msg.loading);
        if (lastIndex !== -1) {
          newMessages[lastIndex] = {
            type: 'bot',
            text: '서버와의 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            loading: false,
          };
        }
        return newMessages;
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAsk();
    }
  };

  return (
    <ChatBotWrapper>
      {open && (
        <ChatWindow ref={chatWindowRef}>
          <ChatHeader>
            <ChatTitle>AI 챗봇</ChatTitle>
            <CloseButton onClick={handleToggle}>
              <IoClose />
            </CloseButton>
          </ChatHeader>
          {/* Messages에 ref 지정, 스크롤 조작 */}
          <Messages ref={messagesEndRef}>
            <ChatBubble isUser={false}>
              <RiRobot2Line style={{ marginRight: 4 }} />
              안녕하세요! 무엇을 도와드릴까요?
            </ChatBubble>

            {messages.map((msg, idx) => (
              <ChatBubble key={idx} isUser={msg.type === 'user'}>
                {msg.loading ? <PulseLoader color="#acacac" size={6} /> : msg.text}
              </ChatBubble>
            ))}
          </Messages>

          <InputWrapper>
            <Input
              type="text"
              value={question}
              placeholder="궁금한 것을 적어주세요!"
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <SendButton onClick={handleAsk} disabled={isLoading}>
              <IoIosSend size={20} />
            </SendButton>
          </InputWrapper>
        </ChatWindow>
      )}
      <ToggleButton onClick={handleToggle}>
        <TbMessageChatbot size={32} />
      </ToggleButton>
    </ChatBotWrapper>
  );
};

export default ChatBot;
