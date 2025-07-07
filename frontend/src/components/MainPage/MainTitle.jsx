import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: ${({ theme }) => `${theme.spacing[24]} 0 0 0`};
  background: ${({ theme }) => theme.colors.white};
`;
const Title = styled.h1`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
`;

const MainTitle = () => (
  <Wrapper>
    <Title>당신의 건강 파트너, 전문코치와 함께</Title>
  </Wrapper>
);

export default MainTitle;
