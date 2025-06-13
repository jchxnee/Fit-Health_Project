import React, { useState, useMemo, useRef, useEffect } from 'react'; // useRef, useEffect 추가
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme'; // theme 임포트 추가 (SubTable이 ThemeProvider 내부에 있어도 CSS 변수를 직접 사용하지 않는 이상 필요)

const SubTable = ({ data, columns, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null); // 열려있는 메뉴의 row id를 저장
  const menuRef = useRef(null); // 메뉴 외부 클릭 감지를 위한 ref

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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null); // 메뉴 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

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
  const handleThreeDotsMenuClick = (e, rowId) => {
    e.stopPropagation(); // 행 클릭 이벤트가 전파되는 것을 막음
    setOpenMenuId(openMenuId === rowId ? null : rowId); // 이미 열려있으면 닫고, 아니면 열기
  };

  // 메뉴 아이템 클릭 핸들러
  const handleMenuItemClick = (e, action, rowData) => {
    e.stopPropagation(); // 메뉴 아이템 클릭 시 메뉴가 바로 닫히지 않도록
    setOpenMenuId(null); // 메뉴 아이템 클릭 후 메뉴 닫기
    alert(`${rowData.coachName} 코치의 ${action} 선택됨!`); // 실제 로직으로 대체
    // 예: if (action === '1:1 채팅') { /* 1:1 채팅 로직 */ }
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
            <tr key={row.id || rowIndex} onClick={() => handleRowClick(row)}>
              {' '}
              {/* row.id 사용 권장, 없으면 rowIndex 사용 */}
              {columns.map((col) => (
                <td key={col.key}>{col.key === 'status' ? <StatusBadge status={row[col.key]} /> : row[col.key]}</td>
              ))}
              <TdMenuCell>
                {' '}
                {/* 새로운 Styled-component 추가 */}
                <ThreeDotsMenu onClick={(e) => handleThreeDotsMenuClick(e, row.id)}>
                  <CiMenuKebab />
                </ThreeDotsMenu>
                {openMenuId === row.id && (
                  <PopupMenu ref={menuRef}>
                    <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '1:1 채팅', row)}>1:1 채팅</PopupMenuItem>
                    <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '정산신청', row)}>정산신청</PopupMenuItem>
                    <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '승인', row)}>승인</PopupMenuItem>
                    <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '거절', row)}>거절</PopupMenuItem>
                    <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '삭제', row)} $isDelete>
                      삭제
                    </PopupMenuItem>
                  </PopupMenu>
                )}
              </TdMenuCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default SubTable;

// 기존 Styled-components 정의 (변동 없음)
const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 10px;
  width: ${theme.width.lg};
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
  position: relative; /* 팝업 메뉴의 기준점 */
  z-index: 1; /* 다른 요소 위에 팝업이 뜨도록 */
`;

// 새로 추가된 Styled-components
const TdMenuCell = styled.td`
  position: relative; /* 팝업 메뉴의 위치를 위한 기준점 설정 */
  width: 50px; /* 케밥 메뉴 아이콘이 들어갈 칸의 너비 조정 */
  text-align: center !important; /* 가운데 정렬 */
`;

const PopupMenu = styled.div`
  position: absolute;
  top: 100%; /* 더보기 버튼 바로 아래에 위치 */
  right: 0; /* 더보기 버튼의 우측 정렬 */
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray['200']};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  min-width: 120px; /* 메뉴의 최소 너비 */
  z-index: ${theme.zIndices.dropdown}; /* 다른 UI 요소 위에 표시 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* border-radius 적용을 위해 */
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
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

  &:hover {
    background-color: ${theme.colors.gray['100']};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray['100']};
  }
`;
