import React from 'react';
import styled from 'styled-components';

function TitleBar({ title }) {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}

export default TitleBar;

const Container = styled.div`
  width: 1008px;
  display: flex;
  margin-top: ${({ theme }) => theme.spacing['8']};
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  border-top: 1px solid ${({ theme }) => theme.colors.gray['400']};
`;

const Title = styled.div`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
`;
