import styled from 'styled-components';

export const ContentWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

export const RecommendedExerciseWrapper = styled.div`
  width: 100%;
  max-width: 1008px;
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const Section = styled.section`
  /* 각 큰 약관 섹션 (예: 회사 주식회사 FIT-GPT 이용약관) */
  margin-bottom: ${({ theme }) => theme.spacing['8']}; /* 32px */
`;

export const SectionHeading = styled.h2`
  /* 각 큰 약관 섹션의 제목 */
  font-size: ${({ theme }) => theme.fontSizes['2xl']}; /* 24px */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary}; /* 파란색 계열 */
  margin-bottom: ${({ theme }) => theme.spacing['6']}; /* 24px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']}; /* 파란색 계열 하단 테두리 */
  padding-bottom: ${({ theme }) => theme.spacing['3']}; /* 12px */
  text-align: left; /* 왼쪽 정렬 */
`;

export const Article = styled.article`
  /* 각 개별 조항 (예: 제1조 목적) */
  margin-bottom: ${({ theme }) => theme.spacing['6']}; /* 24px */
`;

export const ArticleHeading = styled.h3`
  /* 각 조항의 제목 */
  font-size: ${({ theme }) => theme.fontSizes.xl}; /* 20px */
  font-weight: ${({ theme }) => theme.fontWeights.semibold}; /* 600 */
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 8px */
  text-align: left; /* 왼쪽 정렬 */
`;

export const Paragraph = styled.p`
  /* 약관의 본문 내용 */
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 16px */
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 8px */
  text-align: left; /* 왼쪽 정렬 */
`;

export const PolicyTable = styled.table`
  width: 60%;
  border-collapse: collapse; /* 셀 경계를 단일 선으로 만듦 */
  margin-top: ${({ theme }) => theme.spacing['4']}; /* 상단 여백 */
  margin-bottom: ${({ theme }) => theme.spacing['4']}; /* 하단 여백 */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
  color: ${({ theme }) => theme.colors.primary}; /* 기본 텍스트 색상 */
`;

export const TableHeader = styled.th`
  border: 1px solid ${({ theme }) => theme.colors.gray[300]}; /* 테두리 */
  padding: ${({ theme }) => theme.spacing['3']}; /* 12px */
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 헤더 배경색 */
  font-weight: ${({ theme }) => theme.fontWeights.semibold}; /* 폰트 굵기 */
  text-align: center; /* 중앙 정렬 */
  color: ${({ theme }) => theme.colors.primary}; /* 헤더 텍스트 색상 */
`;

export const TableData = styled.td`
  border: 1px solid ${({ theme }) => theme.colors.gray[300]}; /* 테두리 */
  padding: ${({ theme }) => theme.spacing['3']}; /* 12px */
  text-align: left; /* 왼쪽 정렬 */
  vertical-align: top; /* 내용이 위쪽에 정렬되도록 */
`;
