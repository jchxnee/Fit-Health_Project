import React from 'react';
import styled from 'styled-components';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // 1부터 totalPages까지 배열 생성

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        isControl // 제어 버튼임을 표시
      >
        &lt;
      </PageButton>
      {pages.map((page) => (
        <PageButton key={page} onClick={() => onPageChange(page)} isActive={page === currentPage}>
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        isControl // 제어 버튼임을 표시
      >
        &gt;
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;

const PaginationContainer = styled.nav`
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']}; /* 버튼 사이 간격 */
  margin-top: ${({ theme }) => theme.spacing['4']}; /* 테이블 아래 여백 */
`;

const PageButton = styled.button`
  background-color: transparent; /* 배경 투명 */
  border: none;
  color: ${({ theme }) => theme.colors.gray['400']}; /* 기본 텍스트 색상 */
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']}; /* 패딩 */
  border-radius: ${({ theme }) => theme.borderRadius.sm}; /* 약간 둥근 모서리 */
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']}; /* 호버 시 배경색 */
    color: ${({ theme }) => theme.colors.gray['700']}; /* 호버 시 텍스트 색상 */
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.gray['200']};
  }

  /* 선택된 페이지 스타일 */
  ${({ isActive, theme }) =>
    isActive &&
    `
    color: ${theme.colors.black}; /* 선택된 페이지는 진한 검정색 */
    font-weight: ${theme.fontWeights.bold};
    /* background-color: ${theme.colors.gray['100']}; /* 선택 시 배경색 유지 (선택 사항) */
  `}

  /* 이전/다음 버튼 스타일 */
  ${({ isControl, theme }) =>
    isControl &&
    `
    font-size: ${theme.fontSizes.lg}; /* 아이콘은 숫자보다 약간 크게 */
    padding: ${theme.spacing['2']};
    color: ${theme.colors.gray['400']};

    &:disabled {
      color: ${theme.colors.gray['300']}; /* 비활성화 시 색상 */
      cursor: not-allowed;
    }
  `}
`;
