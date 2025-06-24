import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme';
import { Link, useNavigate } from 'react-router-dom';

const UserTable = ({ data, columns, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const currentMenuButtonRef = useRef(null);
  const tableContainerRef = useRef(null);

  const navigate = useNavigate(); //

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
          top: buttonRect.top - tableContainerRect.top,
          left: tableContainerRect.width + 10,
        });
        setOpenMenuId(rowId);
        currentMenuButtonRef.current = e.currentTarget;
      }
    },
    [openMenuId]
  ); // openMenuId를 의존성 배열에 추가하여 상태 변경 시 함수 재생성

  const handleMenuItemClick = (e, action, rowData) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setMenuPosition({ top: 0, left: 0 });
    currentMenuButtonRef.current = null;
    if (action === '결제취소') {
      if (rowData && rowData.paymentId) {
        console.log('결제번호는 : ', rowData.paymentId);
        console.log('navigate 함수 호출 직전! 이동할 경로:', `/refundPage/${rowData.paymentId}`);
        navigate(`/refundPage/${rowData.paymentId}`);
      } else {
        alert('결제 번호를 찾을 수 없습니다.');
      }
    } else if (action === '1:1 채팅') {
      navigate('/chat', { state: { userId: rowData.userId, coachId: rowData.coachId } });
    } else if (action === '후기 남기기') {
      navigate('/reviewCreationPage', { state: { lessonId: rowData.lessonId, coachId: rowData.coachId } });
    } else if (action === '다음 회차예약') {
      navigate('/nextReservation', { state: { currentLesson: rowData } });
    } else if (action === '예약취소') {
      alert(`${rowData.coachName || rowData.name} 코치의 예약을 취소합니다.`);
    } else {
      alert(`${rowData.coachName || rowData.name} 코치의 ${action} 선택됨!`);
    }
  };

  return (
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
      {openMenuId !== null && (
        <PopupMenu ref={menuRef} $top={menuPosition.top} $left={menuPosition.left}>
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
                '후기 남기기',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            후기 남기기
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '다음 회차예약',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            다음 회차예약
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '예약취소',
                sortedData.find((d) => d.id === openMenuId)
              )
            }
          >
            예약취소
          </PopupMenuItem>
          <PopupMenuItem
            onClick={(e) =>
              handleMenuItemClick(
                e,
                '결제취소',
                sortedData.find((d) => d.id === openMenuId) // 현재 행의 모든 데이터를 handleMenuItemClick으로 전달
              )
            }
            $isDelete
          >
            결제취소
          </PopupMenuItem>
        </PopupMenu>
      )}
    </StyledTableContainer>
  );
};

export default UserTable;

// Styled-components (동일)
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
    text-align: center;
    padding-right: calc(${theme.spacing['4']} + 10px);
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
  justify-content: center;
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
  padding-left: ${theme.spacing['2']};
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
