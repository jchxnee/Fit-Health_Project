import React from 'react';
import styled from 'styled-components';

function ButtonTitleBar({ title }) {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}

export default ButtonTitleBar;

const Container = styled.div`
  width: 1008px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const Title = styled.div`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.gray['700']};
  padding: 0 ${({ theme }) => theme.spacing['3']};
`;
