import React, { useState } from 'react'
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from "react-icons/ci";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoReload } from "react-icons/io5";


const SubTable = ({ data, columns }) => {
  // 정렬 상태를 관리하는 state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' }); // 'none', 'ascending', 'descending'

  // 헤더 클릭 시 정렬 상태 변경 핸들러
  const handleSortClick = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) { // 같은 컬럼을 다시 클릭한 경우
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } 
      else {
        direction = 'ascending'; // 정렬 없음 -> 오름차순
      }
    }
    setSortConfig({ key, direction });
  };

  // 정렬 아이콘 렌더링 함수
  const getSortIcon = (key) => {
    if (sortConfig.key !== key || sortConfig.direction === 'none') {
      return <FaSort size={10} />; // 기본 정렬 아이콘
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp size={10} />; // 오름차순 아이콘
    }
    return <FaSortDown size={10} />; // 내림차순 아이콘
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
                  {col.sortable && (
                    <SortIconWrapper>
                      {getSortIcon(col.key)} {/* 정렬 아이콘 렌더링 */}
                    </SortIconWrapper>
                  )}
                </ThContent>
              </th>
            ))}
            <th><IoReload /></th> {/* 새로고침 아이콘을 위한 헤더 */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.key === 'status' ? (
                    <StatusBadge status={row[col.key]} />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <td>
                <ThreeDotsMenu onClick={() => alert('더보기 메뉴 클릭됨')}>
                  <CiMenuKebab />
                </ThreeDotsMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableContainer>
  );
}

export default SubTable

const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-collapse: collapse;
  min-width: 1008px;

  th, td {
    padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
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

  th:last-child, td:last-child {
    text-align: center;
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
