import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * 재사용 가능한 Pagination 컴포넌트
 * @param {object} props
 * @param {number} props.currentPage - 현재 페이지 번호
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {function} props.onPageChange - 페이지 변경 핸들러 함수 (페이지 번호를 인자로 받음)
 * @param {number} [props.maxPagesToShow=10] - 페이지네이션에 표시할 최대 페이지 번호 개수
 */
function Pagination({ currentPage, totalPages, onPageChange, maxPagesToShow = 10 }) {
  // 페이지네이션 렌더링을 위한 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 페이지 수가 maxPagesToShow 보다 적을 경우, 시작 페이지를 1로 조정
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FaChevronLeft />
      </PaginationButton>
      {getPageNumbers().map((pageNumber) => (
        <PaginationNumber
          key={pageNumber}
          isActive={pageNumber === currentPage}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationNumber>
      ))}
      <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <FaChevronRight />
      </PaginationButton>
    </PaginationContainer>
  );
}

export default Pagination;

// --- 스타일 컴포넌트 ---
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing['6']};
  gap: ${({ theme }) => theme.spacing['1']};
`;

const PaginationButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray['600']};
  font-size: ${({ theme }) => theme.fontSizes.md};
  outline: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const PaginationNumber = styled.button`
  background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.white)};
  color: ${({ isActive, theme }) => (isActive ? theme.colors.white : theme.colors.gray['700'])};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-width: 36px;
  outline: none;

  &:hover:not(:disabled):not(:active) {
    background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primaryDark : theme.colors.gray['100'])};
    color: ${({ isActive, theme }) => (isActive ? theme.colors.white : theme.colors.primary)};
  }
`;
