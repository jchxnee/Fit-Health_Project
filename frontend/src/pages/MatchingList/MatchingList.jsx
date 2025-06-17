import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import SelectBar from '../../components/selectbar/BasicSelectBar';
import UserTable from '../../components/UserTable';
import theme from '../../styles/theme';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import MatchingRefuse from '../../components/modal/MatchingRefuse.jsx';

const allMatchingData = [
  {
    id: 1,
    coachName: '김현아',
    category: '도수',
    status: '완료됨',
    sessions: '10회/10회',
    amount: '50,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/04', session: '1회차' },
      { date: '2025/06/06', session: '2회차' },
      { date: '2025/06/08', session: '3회차' },
      { date: '2025/06/10', session: '4회차' },
      { date: '2025/06/12', session: '5회차' },
      { date: '2025/06/14', session: '6회차' },
      { date: '2025/06/16', session: '7회차' },
      { date: '2025/06/18', session: '8회차' },
      { date: '2025/06/20', session: '9회차' },
      { date: '2025/06/22', session: '10회차' },
    ],
  },
  {
    id: 2,
    coachName: '이주찬',
    category: '재활',
    status: '진행중',
    sessions: '2회/10회',
    amount: '138,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/04', session: '1회차' },
      { date: '2025/06/06', session: '2회차' },
    ],
  },
  {
    id: 3,
    coachName: '전진영',
    category: '헬스',
    status: '완료됨',
    sessions: '4회/4회',
    amount: '182,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/01', session: '1회차' },
      { date: '2025/06/02', session: '2회차' },
      { date: '2025/06/03', session: '3회차' },
      { date: '2025/06/04', session: '4회차' },
    ],
  },
  {
    id: 4,
    coachName: '전진영',
    category: '헬스',
    status: '취소됨',
    sessions: '0회/9회',
    amount: '440,000원',
    startDate: '2025/06/04 19:00',
    history: [], // 취소된 기록은 비어있을 수 있음
  },
  {
    id: 5,
    coachName: '황인태',
    category: '도수',
    status: '진행중',
    sessions: '8회/10회',
    amount: '423,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/01', session: '1회차' },
      { date: '2025/06/03', session: '2회차' },
      { date: '2025/06/05', session: '3회차' },
      { date: '2025/06/07', session: '4회차' },
      { date: '2025/06/09', session: '5회차' },
      { date: '2025/06/11', session: '6회차' },
      { date: '2025/06/13', session: '7회차' },
      { date: '2025/06/15', session: '8회차' },
    ],
  },
  {
    id: 6,
    coachName: '전진영',
    category: '재활',
    status: '완료됨',
    sessions: '10회/10회',
    amount: '517,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/05/20', session: '1회차' },
      { date: '2025/05/22', session: '2회차' },
      { date: '2025/05/24', session: '3회차' },
      { date: '2025/05/26', session: '4회차' },
      { date: '2025/05/28', session: '5회차' },
      { date: '2025/05/30', session: '6회차' },
      { date: '2025/06/01', session: '7회차' },
      { date: '2025/06/03', session: '8회차' },
      { date: '2025/06/05', session: '9회차' },
      { date: '2025/06/07', session: '10회차' },
    ],
  },
  {
    id: 7,
    coachName: '전진영',
    category: '재활',
    status: '취소됨',
    sessions: '0회/10회',
    amount: '517,000원',
    startDate: '2025/06/04 19:00',
    history: [],
  },
  {
    id: 8,
    coachName: '전진영',
    category: '재활',
    status: '진행중',
    sessions: '5회/10회',
    amount: '517,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/04', session: '1회차' },
      { date: '2025/06/07', session: '2회차' },
      { date: '2025/06/10', session: '3회차' },
      { date: '2025/06/13', session: '4회차' },
      { date: '2025/06/16', session: '5회차' },
    ],
  },
  {
    id: 9,
    coachName: '전진영',
    category: '재활',
    status: '완료됨',
    sessions: '10회/10회',
    amount: '517,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/04/10', session: '1회차' },
      { date: '2025/04/12', session: '2회차' },
      { date: '2025/04/14', session: '3회차' },
      { date: '2025/04/16', session: '4회차' },
      { date: '2025/04/18', session: '5회차' },
      { date: '2025/04/20', session: '6회차' },
      { date: '2025/04/22', session: '7회차' },
      { date: '2025/04/24', session: '8회차' },
      { date: '2025/04/26', session: '9회차' },
      { date: '2025/04/28', session: '10회차' },
    ],
  },
  {
    id: 10,
    coachName: '전진영',
    category: '재활',
    status: '진행중',
    sessions: '7회/10회',
    amount: '517,000원',
    startDate: '2025/06/04 19:00',
    history: [
      { date: '2025/06/01', session: '1회차' },
      { date: '2025/06/03', session: '2회차' },
      { date: '2025/06/05', session: '3회차' },
      { date: '2025/06/07', session: '4회차' },
      { date: '2025/06/09', session: '5회차' },
      { date: '2025/06/11', session: '6회차' },
      { date: '2025/06/13', session: '7회차' },
    ],
  },
];

const tableColumns = [
  { key: 'coachName', label: '코치 이름', sortable: true },
  { key: 'category', label: '카테고리', sortable: true },
  { key: 'status', label: '상태', sortable: true },
  { key: 'sessions', label: '횟수', sortable: true },
  { key: 'amount', label: '결제금액', sortable: true },
  { key: 'startDate', label: '시작일자', sortable: true },
];

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: ${theme.width.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
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

const MatchingList = () => {
  const selectBarOptions = [
    { label: '전체', value: 'all' },
    { label: '완료됨', value: '완료됨' },
    { label: '진행중', value: '진행중' },
    { label: '취소됨', value: '취소됨' },
  ];

  const [currentSelection, setCurrentSelection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 표시할 항목 수

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    let currentFilteredData = allMatchingData;

    if (currentSelection !== 'all') {
      currentFilteredData = currentFilteredData.filter((item) => {
        return item.status === currentSelection;
      });
    }

    if (searchTerm) {
      currentFilteredData = currentFilteredData.filter((item) =>
        item.coachName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(currentFilteredData);
    setCurrentPage(1); // 필터링 또는 검색 시 현재 페이지를 1로 초기화
  }, [currentSelection, searchTerm]);

  // 현재 페이지에 해당하는 데이터만 잘라냄
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSelectBarChange = (selectedValue) => {
    setCurrentSelection(selectedValue);
    console.log('Selected option:', selectedValue);
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

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <PageWrapper>
        <TitleBar title={'신청내역'} />
        <ContentWrapper>
          <TableWrapper>
            <SelectBar options={selectBarOptions} onSelect={handleSelectBarChange} initialSelected={'all'} />
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput type="text" placeholder="이름 검색" value={searchTerm} onChange={handleSearchChange} />
            </SearchInputWrapper>
          </TableWrapper>
          <UserTable data={currentItems} columns={tableColumns} onRowClick={handleRowClick} />
          {/* Pagination 컴포넌트에 prop 전달 */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </ContentWrapper>
      </PageWrapper>

      {selectedRowData && (
        <MatchingRefuse
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          coachName={selectedRowData.coachName}
          sessions={selectedRowData.sessions}
          history={selectedRowData.history || []}
        />
      )}
    </>
  );
};

export default MatchingList;
