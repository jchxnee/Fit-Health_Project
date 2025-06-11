import React from 'react';
import styled from 'styled-components';

function TitleBar() {
  return (
    <Container>
      <Divider />
      <Title>운동 추천</Title>
    </Container>
  );
}

export default TitleBar;

const Container = styled.div`
  width: 1008px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.div`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.gray['700']};
  padding: 0 ${({ theme }) => theme.spacing['3']};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray['400']};
  width: 100%;
`;
