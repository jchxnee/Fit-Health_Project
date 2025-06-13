import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

function CompletionMessage() {
  return (
    <Container>
      <CheckIcon />
      <Message>신청이 완료되었습니다.</Message>
    </Container>
  );
}

export default CompletionMessage;

const Container = styled.div`
  width: 370px;
  height: 69px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing['4']};
  box-sizing: border-box;
`;

const CheckIcon = styled(FaCheckCircle)`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  color: ${({ theme }) => theme.colors.success};
  margin-right: ${({ theme }) => theme.spacing['3']};
`;

const Message = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['800']};
  white-space: nowrap;
`;
