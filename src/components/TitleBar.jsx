import React from 'react';
import styled from 'styled-components';

function RecommendedExerciseSection({ title }) {
  return (
    <Container>
      <Divider />
      <Title>{title}</Title>
    </Container>
  );
}

export default RecommendedExerciseSection;

const Container = styled.div`
  width: 1008px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.div`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.gray['700']};
  padding: 0 ${({ theme }) => theme.spacing['3']};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray['400']};
  width: 100%;
`;
