import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SelectBar from '../../components/selectbar/BasicSelectBar.jsx';
import theme from '../../styles/theme.js';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination.jsx';
import TrainerTable from '../TrainerTable.jsx';
import CoachSubBar from './CoachSubBar.jsx';
import CoachHistoryModal from '../modal/CoachHistoryModal.jsx';

const tableColumns = [
  { key: 'userName', label: '고객 이름', sortable: true },
  { key: 'category', label: '카테고리', sortable: true },
  { key: 'status', label: '상태', sortable: true },
  { key: 'sessions', label: '횟수', sortable: true },
  { key: 'productPrice', label: '결제금액', sortable: true },
  { key: 'startDate', label: '시작일자', sortable: true },
];

const ContentWrapper = styled.div`
  width: ${theme.width.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[2]};
`;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  width: 280px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
`;

const SearchIcon = styled(FaSearch)`
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-right: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const SubWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`;

const CoachMatchingList = ({ allMatchingData: initialMatchingData, onView, currentView, onDataUpdate }) => {
  // '승인 대기중' 옵션 제거
  const selectBarOptions = [
    { label: '전체', value: 'all' },
    { label: '완료됨', value: '완료됨' },
    { label: '진행중', value: '진행중' },
    { label: '취소됨', value: '취소됨' },
  ];

  const [currentSelection, setCurrentSelection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    let currentFilteredData = initialMatchingData;

    if (currentSelection !== 'all') {
      // '승인 대기중' 필터링 로직 제거
      currentFilteredData = currentFilteredData.filter((item) => item.status === currentSelection);
    }

    if (searchTerm) {
      currentFilteredData = currentFilteredData.filter((item) =>
        item.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(currentFilteredData);
    setCurrentPage(1);
  }, [currentSelection, searchTerm, initialMatchingData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSelectBarChange = (selectedValue) => {
    setCurrentSelection(selectedValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
  };

  const handleHistoryModalUpdateSuccess = (reservationId, status) => {
    console.log(`[CoachMatchingList] Reservation ${reservationId} updated to ${status}. Notifying parent.`);
    if (onDataUpdate) {
      onDataUpdate();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <ContentWrapper>
        <TableWrapper>
          <SelectBar options={selectBarOptions} onSelect={handleSelectBarChange} initialSelected={'all'} />
          <SubWrapper>
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput type="text" placeholder="이름 검색" value={searchTerm} onChange={handleSearchChange} />
            </SearchInputWrapper>
            <CoachSubBar onView={onView} currentView={currentView} />
          </SubWrapper>
        </TableWrapper>
        <TrainerTable data={currentItems} columns={tableColumns} onRowClick={handleRowClick} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </ContentWrapper>

      {selectedRowData && (
        <CoachHistoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userName={selectedRowData.userName}
          sessions={selectedRowData.sessions}
          history={selectedRowData.history || []}
          onUpdateSuccess={handleHistoryModalUpdateSuccess}
        />
      )}
    </>
  );
};

export default CoachMatchingList;
