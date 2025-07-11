import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import sadFace from '../../public/img/404SadIcon.png';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Code = styled.div`
  display: flex;
  align-items: center;
  font-size: 120px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 16px;
`;

const Number = styled.span`
  margin: 0 12px;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Message = styled.p`
  font-size: 20px;
  color: #868e96;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: none;
  color: #3d4149;
  font-size: 16px;
  cursor: pointer;
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Code>
        <Number>4</Number>
        <Image src={sadFace} alt="sad face" />
        <Number>4</Number>
      </Code>
      <Message>페이지를 찾을 수 없습니다</Message>
      <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
    </Container>
  );
};

export default NotFound;
