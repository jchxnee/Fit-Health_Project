// src/components/SubTable.jsx

import React, { useState, useMemo } from 'react'; // useMemo 추가
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';

// 기존 Styled-components는 그대로 유지합니다.
// theme 임포트는 SubTable이 ThemeProvider 내부에 있다면 필요 없습니다.
// import theme from '../styles/theme'; // SubTable이 ThemeProvider 내부에 있다면 이 줄은 필요 없음.

const SubTable = ({ data, columns, onRowClick }) => {
  // onRowClick prop 추가
  // 정렬 상태를 관리하는 state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  // 정렬된 데이터 반환 함수 (useMemo 최적화)
  const sortedData = useMemo(() => {
    // useMemo 훅 사용
    let sortableItems = [...data];
    if (sortConfig.key !== null && sortConfig.direction !== 'none') {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // 숫자 값은 숫자로 비교
        const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

        if (isNumeric(aValue) && isNumeric(bValue)) {
          return (parseFloat(aValue) - parseFloat(bValue)) * (sortConfig.direction === 'ascending' ? 1 : -1);
        }
        // 문자열 값은 로케일 기반으로 비교
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // 헤더 클릭 시 정렬 상태 변경 핸들러
  const handleSortClick = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'none'; // 내림차순 -> 정렬 없음 (원래 상태로 돌아가기)
      }
    }
    setSortConfig({ key, direction });
  };

  // 정렬 아이콘 렌더링 함수
  const getSortIcon = (key) => {
    if (sortConfig.key !== key || sortConfig.direction === 'none') {
      return <FaSort size={10} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp size={10} />;
    }
    return <FaSortDown size={10} />;
  };

  // 행 클릭 핸들러
  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <StyledTableContainer>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={col.sortable ? () => handleSortClick(col.key) : undefined}>
                <ThContent>
                  {col.label}
                  {col.sortable && <SortIconWrapper>{getSortIcon(col.key)}</SortIconWrapper>}
                </ThContent>
              </th>
            ))}
            <th>
              <IoReload style={{ cursor: 'pointer' }} onClick={() => setSortConfig({ key: null, direction: 'none' })} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            // 각 행에 onClick 이벤트 추가
            <tr key={rowIndex} onClick={() => handleRowClick(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.key === 'status' ? <StatusBadge status={row[col.key]} /> : row[col.key]}</td>
              ))}
              <td>
                {/* 더보기 메뉴 버튼에 onClick을 달고, 필요시 데이터 넘김 */}
                <ThreeDotsMenu
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`더보기 메뉴 클릭됨: ${row.coachName}`);
                  }}
                >
                  <CiMenuKebab />
                </ThreeDotsMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default SubTable;

// Styled-components 정의 (theme를 사용한다면 SubTable이 ThemeProvider 내부에 있어야 합니다.)
const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  width: ${({ theme }) => theme.width.lg};
`;

const StyledTable = styled.table`
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-collapse: collapse;
  width: 100%;
  min-width: 800px;

  th,
  td {
    padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
    white-space: nowrap;
  }

  th {
    background-color: ${({ theme }) => theme.colors.gray['100']};
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    cursor: pointer;
    user-select: none;
  }

  td {
    color: ${({ theme }) => theme.colors.gray['700']};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  th:last-child,
  td:last-child {
    text-align: center;
  }

  tr {
    cursor: pointer; /* 행에 마우스 오버 시 커서 변경 */
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const ThContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const SortIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray['400']};
`;

const ThreeDotsMenu = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing['1']};
  color: ${({ theme }) => theme.colors.gray['500']};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 100%;
  height: 100%;
`;
