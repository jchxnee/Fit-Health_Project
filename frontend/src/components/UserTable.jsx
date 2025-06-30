import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme'; // theme 파일 경로가 올바른지 확인해주세요.
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RefundModal from './modal/RefundModal';

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

const UserTable = ({ data, columns, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundRowData, setRefundRowData] = useState(null);
  const menuRef = useRef(null);
  const currentMenuButtonRef = useRef(null);
  const tableContainerRef = useRef(null);
  const navigate = useNavigate();

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

  const handleRowClick = (row) => {
    console.log('--- handleRowClick 호출 시점 rowData (스냅샷) ---');
    console.log('rowData (deep clone):', JSON.parse(JSON.stringify(row)));
    console.log('rowData.sessions (직접):', row.sessions);
    console.log('--- handleRowClick 호출 시점 rowData 종료 ---');

    if (onRowClick) {
      onRowClick(row);
    }
  };

  // 'status: Y'인 항목 중 가장 최근 예약 날짜와, 전체 history 중 가장 최근 예약의 상태 및 거절 사유 존재 여부를 동시에 반환
  const getLatestReservationInfo = useCallback((history) => {
    if (!history || history.length === 0) {
      // ⭐ 추가: rejectCommentExists 필드도 반환 ⭐
      return { latestApprovedDate: null, latestOverallStatus: null, latestRejectCommentExists: false };
    }

    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.selectDate);
      const dateB = new Date(b.selectDate);
      return dateB.getTime() - dateA.getTime();
    });

    const latestStatus = sortedHistory[0].status; // 제일 최근 예약내역의 승인상태
    // ⭐ 추가: 제일 최근 예약내역의 거절 사유 존재 여부 ⭐
    const latestRejectCommentExists = !!sortedHistory[0].rejectComment;

    const approvedHistory = sortedHistory.filter((item) => item.status === 'Y');
    const latestApprovedDate = approvedHistory.length > 0 ? new Date(approvedHistory[0].selectDate) : null; // 제일 최근 예약내역의 날짜

    // ⭐ 반환 값에 latestRejectCommentExists 추가 ⭐
    return { latestApprovedDate, latestStatus, latestRejectCommentExists };
  }, []);

  const handleThreeDotsMenuClick = useCallback(
    (e, rowPaymentId) => {
      e.stopPropagation();

      if (openMenuId === rowPaymentId) {
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
          left: tableContainerRect.width + 10,
        });
        setOpenMenuId(rowPaymentId);
        currentMenuButtonRef.current = e.currentTarget;
      }
    },
    [openMenuId]
  );

  const handleMenuItemClick = (e, action, rowData) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setMenuPosition({ top: 0, left: 0 });
    currentMenuButtonRef.current = null;
    console.log('--- handleMenuItemClick 호출 시점 rowData ---');
    console.log('rowData (deep clone):', JSON.parse(JSON.stringify(rowData)));
    console.log('rowData.sessions (직접):', rowData.sessions);
    console.log('rowData.hasReview (직접):', rowData.hasReview);
    console.log('--- handleMenuItemClick 호출 시점 rowData 종료 ---');

    if (action === '결제취소') {
      navigate(`/refundPage/${rowData.paymentId}`);
    } else if (action === '1:1 채팅') {
      navigate('/chat');
    } else if (action === '후기 남기기') {
      if (rowData.status === '완료됨' && !rowData.hasReview) {
        navigate('/reviewCreationPage', {
          state: {
            paymentId: rowData.paymentId,
            trainerName: rowData.trainerName,
            trainerNo: rowData.trainerNo,
          },
        });
      } else if (rowData.hasReview) {
        toast.info('이미 후기를 작성했습니다.');
      } else {
        toast.warn('완료된 수업에 대해서만 후기를 남길 수 있습니다.');
      }
    } else if (action === '다음 회차예약') {
      // ⭐ 변경: latestRejectCommentExists를 사용하도록 조건 수정 ⭐
      const { latestOverallStatus, latestRejectCommentExists } = getLatestReservationInfo(rowData.history);

      // 코치 승인 대기 중이고 거절 사유가 없을 때만 경고 메시지 표시
      if (latestOverallStatus === 'N' && !latestRejectCommentExists) {
        toast.warn('코치 승인 대기 중인 예약이 있어 다음 회차 예약을 할 수 없습니다.');
        return; // 예약 진행을 막음
      }

      const sessionsParts = rowData.sessions.split(/\s*\/\s*/);
      const currentSessions = parseInt(sessionsParts[0].trim(), 10);
      const totalSessions = parseInt(sessionsParts[1].trim(), 10);

      if (rowData.status === '진행중' && currentSessions < totalSessions) {
        navigate('/nextReservation', { state: { currentLesson: rowData } });
      } else {
        toast.warn('이미 모든 수업을 예약했거나 수업이 진행중인 상태여야만 다음 회차 예약을 할 수 있습니다.');
      }
    } else if (action === '환불내역') {
      setRefundRowData(rowData);
      setIsRefundModalOpen(true);
    }
  };

  // PopupMenu가 열려있을 때만 해당 rowData와 날짜 조건을 계산
  const selectedRowData = useMemo(() => {
    if (openMenuId === null) return null;
    return sortedData.find((d) => d.paymentId === openMenuId);
  }, [openMenuId, sortedData]);

  // 가장 최근 예약 정보를 가져옴
  // ⭐ 변경: latestRejectCommentExists도 함께 가져옴 ⭐
  const { latestApprovedDate, latestStatus, latestRejectCommentExists } = useMemo(() => {
    return selectedRowData ? getLatestReservationInfo(selectedRowData.history) : {};
  }, [selectedRowData, getLatestReservationInfo]);

  const now = new Date();
  const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

  // 코치 승인된 가장 최근 예약일로부터 24시간이 '경과하지 않았는지'
  const isWithin24HoursOfLatestApprovedBooking = latestApprovedDate
    ? now.getTime() - latestApprovedDate.getTime() < TWENTY_FOUR_HOURS_IN_MS
    : false;

  // 메뉴가 보여야 하는 조건:
  // 1. 코치 승인된 가장 최근 예약일로부터 24시간이 경과했거나,
  // 2. (코치 승인 대기 중이 아니거나) OR (코치 승인 대기 중이지만 거절 사유가 있을 때)
  const nextActionMenu = latestStatus == 'Y' || (latestStatus == 'N' && latestRejectCommentExists);

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
          {sortedData.map((row) => (
            <tr key={row.paymentId} onClick={() => handleRowClick(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.key === 'status' ? <StatusBadge status={row[col.key]} /> : row[col.key]}</td>
              ))}
              <TdMenuCell>
                <ThreeDotsMenu onClick={(e) => handleThreeDotsMenuClick(e, row.paymentId)}>
                  <CiMenuKebab />
                </ThreeDotsMenu>
              </TdMenuCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {openMenuId !== null && selectedRowData && (
        <PopupMenu ref={menuRef} $top={menuPosition.top} $left={menuPosition.left}>
          <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '1:1 채팅', selectedRowData)}>1:1 채팅</PopupMenuItem>
          {/* 후기 남기기 버튼: 완료된 수업이고 아직 후기가 없는 경우에만 보임 */}
          {selectedRowData.hasReview === false && selectedRowData.status === '완료됨' && (
            <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '후기 남기기', selectedRowData)}>
              후기 남기기
            </PopupMenuItem>
          )}
          {/* 다음 회차 예약 버튼:
                1. '진행중' 상태
                2. 'shouldShowActionMenus' (통합 조건)가 true일 때
          */}
          {selectedRowData.status === '진행중' && nextActionMenu && (
            <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '다음 회차예약', selectedRowData)}>
              다음 회차예약
            </PopupMenuItem>
          )}
          {/* 결제 취소 버튼:
                1. 'refund'가 true
                2. 'shouldShowActionMenus' (통합 조건)가 true일 때
          */}
          {selectedRowData.refund && !isWithin24HoursOfLatestApprovedBooking && (
            <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '결제취소', selectedRowData)} $isDelete>
              결제취소
            </PopupMenuItem>
          )}
          {selectedRowData.hasRefund && (
            <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '환불내역', selectedRowData)}>환불내역</PopupMenuItem>
          )}
        </PopupMenu>
      )}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setRefundRowData(null);
        }}
        data={refundRowData}
      />
    </StyledTableContainer>
  );
};

export default UserTable;
