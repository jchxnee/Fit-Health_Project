import React from 'react';
import styled from 'styled-components';
import media from '../../utils/media';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: ${({ theme }) => `${theme.spacing[24]} 0 0 0`};
  background: ${({ theme }) => theme.colors.white};

  ${media.md` // 화면 너비가 768px 이하일 때
    padding-top: ${({ theme }) => theme.spacing[16]}; // 상단 패딩 줄이기
  `}
  ${media.sm` // 화면 너비가 576px 이하일 때
    padding-top: ${({ theme }) => theme.spacing[12]};
  `}
`;

const Title = styled.h1`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center; // 중앙 정렬

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xl}; // 글자 크기 줄이기
    padding: 0 ${({ theme }) => theme.spacing[4]}; // 좌우 패딩 추가
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
`;

const MainTitle = () => (
  <Wrapper>
    <Title>당신의 건강 파트너, 전문코치와 함께</Title>
  </Wrapper>
);

export default MainTitle;
