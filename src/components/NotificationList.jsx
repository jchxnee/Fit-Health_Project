import React from 'react';
import styled from 'styled-components';

function NotificationList() {
  const notifications = [
    { message: '김현아 코치님께서 코칭 승인하셨습니다. 결제를 진행해주세요.', time: '2분 전' },
    { message: '전진영 코치님의 수업 결제가 완료되었습니다.', time: '2시간 전' },
    { message: '이주찬 코치님의 수업이 하루 남았습니다.', time: '3일 전' },
    { message: '황인태 코치님의 수업이 종료되었습니다. 리뷰를 남겨주세요.', time: '1달 전' },
  ];

  return (
    <Container>
      <Title>알림</Title>
      {notifications.map((notification, index) => (
        <NotificationItem key={index}>
          <Message>{notification.message}</Message>
          <Time>{notification.time}</Time>
        </NotificationItem>
      ))}
    </Container>
  );
}

export default NotificationList;

const Container = styled.div`
  width: 292px;
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  text-align: start;
`;

const Title = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
`;

const NotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
`;

const Time = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  color: ${({ theme }) => theme.colors.primary};
`;
