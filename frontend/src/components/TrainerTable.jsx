import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme';
import SalaryModal from './modal/SalaryModal';
import HealthChartModal from './modal/HealthChartModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { startPrivateChat } from '../api/chatApi';

const TrainerTable = ({ data, columns, onRowClick, fetchData, onApprove, onReject }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const currentMenuButtonRef = useRef(null);
  const tableContainerRef = useRef(null);
  const [salaryModalData, setSalaryModalData] = useState(null);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const navigate = useNavigate();

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null && sortConfig.direction !== 'none') {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // ⭐ 날짜/시간 필드 정렬을 위한 특수 처리 추가 ⭐
        if (sortConfig.key === 'startDate' || sortConfig.key === 'paymentAt' || sortConfig.key === 'reservationAt') {
          const dateA = aValue ? new Date(aValue) : null;
          const dateB = bValue ? new Date(bValue) : null;

          if (dateA && dateB) {
            return (dateA.getTime() - dateB.getTime()) * (sortConfig.direction === 'ascending' ? 1 : -1);
          }
          // null 값 처리: null은 항상 마지막으로 정렬
          if (dateA === null) return 1;
          if (dateB === null) return -1;
          return 0; // 둘 다 null인 경우
        }

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        currentMenuButtonRef.current &&
        !currentMenuButtonRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
        setMenuPosition({ top: 0, left: 0 });
        currentMenuButtonRef.current = null;
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

  const handleRowClickInternal = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleThreeDotsMenuClick = useCallback(
    (e, rowId) => {
      e.stopPropagation();

      if (openMenuId === rowId) {
        setOpenMenuId(null);
        setMenuPosition({ top: 0, left: 0 });
        currentMenuButtonRef.current = null;
      } else {
        const buttonRect = e.currentTarget.getBoundingClientRect();
        const tableContainer = tableContainerRef.current;
        const tableContainerRect = tableContainer ? tableContainer.getBoundingClientRect() : null;

        if (!tableContainerRect) {
          console.warn('Table container ref not found. Popup might not position correctly.');
          return;
        }

        setMenuPosition({
          top: buttonRect.top - tableContainerRect.top,
          left: buttonRect.left - tableContainerRect.left + buttonRect.width + 10,
        });
        setOpenMenuId(rowId);
        currentMenuButtonRef.current = e.currentTarget;
      }
    },
    [openMenuId]
  );

  const handleMenuItemClick = async (e, action, rowData) => {
    e.stopPropagation();

    if (action === '1:1 채팅') {
      try {
        const myEmail = sessionStorage.getItem('userEmail');
        let otherMemberEmail = null;
        if (myEmail === rowData.userEmail) {
          // 내가 회원 → 상대방은 트레이너
          otherMemberEmail = rowData.trainerEmail;
        } else {
          // 내가 트레이너 → 상대방은 회원
          otherMemberEmail = rowData.userEmail;
        }
        if (!otherMemberEmail) {
          alert('상대방 이메일 정보가 없습니다.');
          return;
        }
        if (otherMemberEmail === myEmail) {
          alert('자기 자신과는 채팅할 수 없습니다.');
          return;
        }
        const roomId = await startPrivateChat(otherMemberEmail);
        navigate(`/chatpage/${roomId}`);
      } catch (error) {
        alert('채팅방 생성에 실패했습니다.');
      }
    } else if (action === '승인') {
      if (onApprove) {
        onApprove(rowData);
      }
    } else if (action === '거절') {
      if (onReject) {
        onReject(rowData);
      }
    } else if (action === '정산신청') {
      setSalaryModalData(rowData);
    } else if (action === '고객 건강정보') {
      setSelectedEmail(rowData.userEmail);
      setHealthModalOpen(true);
    } else if (action === '정산내역') {
      setSalaryModalData(rowData); // 정산내역도 동일 모달 사용
    }

    setOpenMenuId(null);
    setMenuPosition({ top: 0, left: 0 });
    currentMenuButtonRef.current = null;
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
            <tr key={row.id || rowIndex} onClick={() => handleRowClickInternal(row)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.key === 'status' ? (
                    <StatusBadge status={row[col.key]} />
                  ) : // ⭐ 날짜/시간 컬럼에 대한 포맷팅 로직 추가 ⭐
                  (col.key === 'startDate' || col.key === 'paymentAt' || col.key === 'reservationAt') &&
                    row[col.key] ? (
                    new Date(row[col.key]).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false, // 24시간 형식
                    })
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <TdMenuCell>
                <ThreeDotsMenu onClick={(e) => handleThreeDotsMenuClick(e, row.id ?? rowIndex)}>
                  <CiMenuKebab />
                </ThreeDotsMenu>
              </TdMenuCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      {openMenuId !== null &&
        (() => {
          const rowData = sortedData.find((d, i) => (d.id ?? i) === openMenuId);
          if (!rowData) return null;

          const isPending = rowData.status?.trim() === '승인 대기중';
          const isCompleted = rowData.status?.trim() === '완료됨';
          const isInProgress = rowData.status?.trim() === '진행중';

          return (
            <PopupMenu ref={menuRef} $top={menuPosition.top} $left={menuPosition.left}>
              <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '1:1 채팅', rowData)}>1:1 채팅</PopupMenuItem>

              {/* '진행중' 상태일 때만 '고객 건강정보' 메뉴 보이기 */}
              {isInProgress && (
                <PopupMenuItem
                  onClick={(e) => {
                    handleMenuItemClick(e, '고객 건강정보', rowData);
                  }}
                >
                  고객 건강정보
                </PopupMenuItem>
              )}

              {/* '완료됨' 상태일 때만 '정산신청' 또는 '정산내역' 메뉴 보이기 */}
              {isCompleted && (
                <PopupMenuItem
                  onClick={(e) => {
                    handleMenuItemClick(e, '정산신청', rowData);
                  }}
                >
                  {rowData.hasSalary ? '정산내역' : '정산신청'}
                </PopupMenuItem>
              )}

              {/* '승인 대기중'일 때만 '승인' 메뉴 보이기 */}
              {isPending && (
                <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '승인', rowData)}>승인</PopupMenuItem>
              )}
              {/* '승인 대기중'일 때만 '거절' 메뉴 보이기 */}
              {isPending && (
                <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '거절', rowData)}>거절</PopupMenuItem>
              )}
            </PopupMenu>
          );
        })()}

      <SalaryModal
        isOpen={!!salaryModalData}
        onClose={() => setSalaryModalData(null)}
        onSuccess={() => {
          setSalaryModalData(null);
          fetchData?.();
        }}
        data={salaryModalData}
      />

      <HealthChartModal isOpen={healthModalOpen} onClose={() => setHealthModalOpen(false)} userEmail={selectedEmail} />
    </StyledTableContainer>
  );
};

export default TrainerTable;

// Styled-components (스타일은 요청에 따라 변경하지 않고 기존 코드 그대로 유지)
const StyledTableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  width: ${theme.width.lg};
  margin-bottom: 60px;
  position: relative;
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
    vertical-align: middle; /* ⭐ 수직 중앙 정렬 추가 ⭐ */
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
    text-align: center; /* ⭐ 왼쪽 정렬로 변경 ⭐ */
  }

  th:last-child,
  td:last-child {
    text-align: center; /* 마지막 컬럼은 가운데 정렬 유지 */
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
  justify-content: center; /* th 내용도 왼쪽 정렬하고 싶다면 이 부분을 left로 변경 */
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
  text-align: center !important; /* 이 셀은 여전히 가운데 정렬 */
`;

const PopupMenu = styled.div`
  position: absolute;
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
