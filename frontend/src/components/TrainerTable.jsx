import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import StatusBadge from './StatusBadge';
import { CiMenuKebab } from 'react-icons/ci';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import theme from '../styles/theme';
import SalaryModal from './modal/SalaryModal';
import HealthChartModal from './modal/HealthChartModal';

const TrainerTable = ({ data, columns, onRowClick, fetchData }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const currentMenuButtonRef = useRef(null);
  const tableContainerRef = useRef(null);
  const [salaryModalData, setSalaryModalData] = useState(null);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

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
          left: tableContainerRect.width + 10,
        });
        setOpenMenuId(rowId);
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
    alert(`${rowData.coachName} 코치의 ${action} 선택됨!`);
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

          return (
            <PopupMenu ref={menuRef} $top={menuPosition.top} $left={menuPosition.left}>
              <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '1:1 채팅', rowData)}>1:1 채팅</PopupMenuItem>

              {rowData.status?.trim() == '진행중' && (
                <PopupMenuItem
                  onClick={() => {
                    setSelectedEmail(rowData.usermail);
                    setHealthModalOpen(true);
                  }}
                >
                  고객 건강정보
                </PopupMenuItem>
              )}

              {rowData.status?.trim() === '완료됨' && (
                <PopupMenuItem
                  onClick={(e) => {
                    handleMenuItemClick(e, '정산신청', rowData);
                    setSalaryModalData(rowData);
                  }}
                >
                  {rowData.hasSalary ? '정산내역' : '정산신청'}
                </PopupMenuItem>
              )}

              <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '승인', rowData)}>승인</PopupMenuItem>
              <PopupMenuItem onClick={(e) => handleMenuItemClick(e, '거절', rowData)}>거절</PopupMenuItem>
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
