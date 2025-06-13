import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme';

const SubTable = ({ data, columns, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null); // 열려있는 메뉴의 row id를 저장
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // 메뉴 위치 상태 추가
  const menuRef = useRef(null); // 팝업 메뉴 DOM 엘리먼트 참조
  const currentMenuButtonRef = useRef(null); // 현재 열린 메뉴를 트리거한 버튼 DOM 엘리먼트 참조
  const tableContainerRef = useRef(null); // StyledTableContainer DOM 엘리먼트 참조

  // 정렬된 데이터 반환 함수 (useMemo 최적화)
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null && sortConfig.direction !== 'none') {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

        if (isNumeric(aValue) && isNumeric(bValue)) {
          return (parseFloat(aValue) - parseFloat(bValue)) * (sortConfig.direction === 'ascending' ? 1 : -1);
        }
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

  // 메뉴 외부 클릭 감지 useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 팝업 메뉴 자체나 팝업 메뉴를 연 버튼이 아닌 다른 곳을 클릭했을 때 닫기
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        currentMenuButtonRef.current &&
        !currentMenuButtonRef.current.contains(event.target)
      ) {
        setOpenMenuId(null); // 메뉴 닫기
        setMenuPosition({ top: 0, left: 0 }); // 메뉴 위치 초기화
        currentMenuButtonRef.current = null; // 버튼 참조 초기화
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentMenuButtonRef, menuRef]);

  const handleSortClick = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'none';
      }
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key || sortConfig.direction === 'none') {
      return <FaSort size={10} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp size={10} />;
    }
    return <FaSortDown size={10} />;
  };

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // 더보기 메뉴 토글 핸들러
  const handleThreeDotsMenuClick = useCallback(
    (e, rowId) => {
      e.stopPropagation(); // 행 클릭 이벤트가 전파되는 것을 막음

      if (openMenuId === rowId) {
        // 이미 열려있는 메뉴를 다시 클릭하면 닫기
        setOpenMenuId(null);
        setMenuPosition({ top: 0, left: 0 });
        currentMenuButtonRef.current = null;
      } else {
        const buttonRect = e.currentTarget.getBoundingClientRect(); // '...' 버튼의 뷰포트 기준 위치
        const tableContainer = tableContainerRef.current; // StyledTableContainer의 DOM 엘리먼트
        const tableContainerRect = tableContainer ? tableContainer.getBoundingClientRect() : null; // 테이블 컨테이너의 뷰포트 기준 위치

        if (!tableContainerRect) {
          console.warn('Table container ref not found. Popup might not position correctly.');
          return;
        }

        setMenuPosition({
          // 팝업의 top은 '...' 버튼의 뷰포트 top에서 테이블 컨테이너의 뷰포트 top을 뺀 값으로 계산 (상대적인 top)
          top: buttonRect.top - tableContainerRect.top,
          // 팝업의 left는 테이블 컨테이너의 전체 너비 (오른쪽 끝) + 여백
          left: tableContainerRect.width + 10, // 10px 여백
        });
        setOpenMenuId(rowId);
        currentMenuButtonRef.current = e.currentTarget; // 현재 열린 메뉴를 트리거한 버튼 참조 저장
      }
    },
    [openMenuId]
  ); // openMenuId를 의존성 배열에 추가하여 상태 변경 시 함수 재생성

  // 메뉴 아이템 클릭 핸들러
  const handleMenuItemClick = (e, action, rowData) => {
    e.stopPropagation(); // 메뉴 아이템 클릭 시 메뉴가 바로 닫히지 않도록
    setOpenMenuId(null); // 메뉴 아이템 클릭 후 메뉴 닫기
    setMenuPosition({ top: 0, left: 0 }); // 위치 초기화
    currentMenuButtonRef.current = null; // 버튼 참조 초기화
    alert(`${rowData.coachName} 코치의 ${action} 선택됨!`); // 실제 로직으로 대체
    // 예: if (action === '1:1 채팅') { /* 1:1 채팅 로직 */ }
  };

  return (
    // StyledTableContainer에 ref 속성 추가
    <StyledTableContainer ref={tableContainerRef}>
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
            <tr key={row.id || rowIndex} onClick={() => handleRowClick(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.key === 'status' ? <StatusBadge status={row[col.key]} /> : row[col.key]}</td>
              ))}
              <TdMenuCell>
                <ThreeDotsMenu onClick={(e) => handleThreeDotsMenuClick(e, row.id)}>
                  <CiMenuKebab />
                </ThreeDotsMenu>
              </TdMenuCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {/* openMenuId가 null이 아닐 때만 팝업 메뉴 렌더링 */}
      {openMenuId !== null && (
        // PopupMenu는 StyledTableContainer의 자식으로, StyledTable 밖에서 렌더링
        <PopupMenu ref={menuRef} $top={menuPosition.top} $left={menuPosition.left}>
          {/* sortedData에서 해당 row 데이터를 찾아 전달 */}
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '1:1 채팅',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            1:1 채팅
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '정산신청',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            정산신청
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '승인',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            승인
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '거절',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            거절
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '삭제',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
            $isDelete
          >
            삭제
          </PopupMenuItem>
        </PopupMenu>
      )}
    </StyledTableContainer>
  );
};

export default SubTable;

// Styled-components (수정된 StyledTableContainer와 PopupMenu)
const StyledTableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  width: ${theme.width.lg};
  margin-bottom: 60px;
  position: relative; /* 중요: 이 요소를 기준으로 자식 absolute 요소가 위치합니다. */
`;

const StyledTable = styled.table`
  border-top: 1px solid ${theme.colors.gray['200']};
  border-bottom: 1px solid ${theme.colors.gray['200']};
  border-collapse: collapse;
  width: 100%;
  min-width: 800px;

  th,
  td {
    padding: ${theme.spacing['3']} ${theme.spacing['4']};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.gray['200']};
    white-space: nowrap;
  }

  th {
    background-color: ${theme.colors.gray['100']};
    color: ${theme.colors.primary};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.fontWeights.medium};
    cursor: pointer;
    user-select: none;
  }

  td {
    color: ${theme.colors.gray['700']};
    font-size: ${theme.fontSizes.sm};
  }

  th:last-child,
  td:last-child {
    text-align: center;
  }

  tr {
    cursor: pointer;
  }

  tr:hover {
    background-color: ${theme.colors.gray['100']};
  }
`;

const ThContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing['1']};
`;

const SortIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray['400']};
`;

const ThreeDotsMenu = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing['1']};
  color: ${theme.colors.gray['500']};
  font-size: ${theme.fontSizes.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  outline: none;
`;

const TdMenuCell = styled.td`
  position: relative;
  width: 50px;
  text-align: center !important;
`;

const PopupMenu = styled.div`
  position: absolute; /* fixed 대신 absolute로 변경 */
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray['200']};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  min-width: 120px;
  z-index: ${theme.zIndices.docked};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  outline: none;
`;

const PopupMenuItem = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing['3']} ${theme.spacing['4']};
  width: 100%;
  text-align: left;
  font-size: ${theme.fontSizes.sm};
  color: ${({ theme, $isDelete }) => ($isDelete ? theme.colors.danger : theme.colors.gray['800'])};
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  &:hover {
    background-color: ${theme.colors.gray['100']};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray['100']};
  }
`;
