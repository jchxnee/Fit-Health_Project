import React, { useState } from 'react';
import styled from 'styled-components';
import { TbMessageChatbot } from 'react-icons/tb';
import { RiRobot2Line } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import api from '../api/axios';
import axios from 'axios';

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
  gap: 8px;
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

  const handleToggle = () => {
    if (open) {
      // 창 닫힐 때 초기화
      setMessages([]);
      setQuestion('');
    }
    setOpen(!open);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: question }]);

    try {
      const res = await api.post('api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessages((prev) => [...prev, { type: 'bot', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.error || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: '서버와의 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      ]);
      console.log(err);
    }

    setQuestion('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <ChatBotWrapper>
      {open && (
        <ChatWindow>
          <ChatHeader>
            <ChatTitle>AI 챗봇</ChatTitle>
            <CloseButton onClick={handleToggle}>
              <IoClose />
            </CloseButton>
          </ChatHeader>
          <Messages>
            <ChatBubble isUser={false}>
              <RiRobot2Line style={{ marginRight: 4 }} />
              안녕하세요! 무엇을 도와드릴까요?
            </ChatBubble>
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} isUser={msg.type === 'user'}>
                {msg.text}
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
            />
            <SendButton onClick={handleAsk}>
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
