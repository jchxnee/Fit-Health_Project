import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar.jsx'; // 컴포넌트 경로 확인
import SelectBar from '../../components/selectbar/BasicSelectBar.jsx'; // 컴포넌트 경로 확인
import theme from '../../styles/theme.js'; // 테마 경로 확인
import { FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination.jsx'; // Pagination 컴포넌트 임포트 확인
import MatchingRefuse from '../../components/modal/MatchingRefuse';
import TrainerTable from '../TrainerTable.jsx';
import CoachSubBar from './CoachSubBar.jsx'; // CoachSubBar 임포트 추가

const tableColumns = [
  { key: 'userName', label: '고객 이름', sortable: true },
  { key: 'category', label: '카테고리', sortable: true },
  { key: 'status', label: '상태', sortable: true },
  { key: 'sessions', label: '횟수', sortable: true },
  { key: 'productPrice', label: '결제금액', sortable: true },
  { key: 'startDate', label: '시작일자', sortable: true },
];

const ContentWrapper = styled.div`
  width: ${theme.width.lg}; /* 테마에서 정의된 너비 사용 */
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
  gap: 16px; /* 검색창과 버튼 사이 간격 추가 */
  align-items: center; /* 수직 정렬 */
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #999;
`;

// allMatchingData와 함께 onView, currentView prop을 받도록 수정
const CoachMatchingList = ({ allMatchingData: initialMatchingData, onView, currentView, onSalarySuccess }) => {
  // <-- prop 추가
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

  // useEffect의 의존성 배열에 initialMatchingData를 추가
  useEffect(() => {
    let currentFilteredData = initialMatchingData; // prop으로 받은 데이터 사용

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
    setCurrentPage(1);
  }, [currentSelection, searchTerm, initialMatchingData]); // initialMatchingData 추가

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
            {/* CoachSubBar를 여기에 렌더링하고 props 전달 */}
            <CoachSubBar onView={onView} currentView={currentView} /> {/* <-- 추가 */}
          </SubWrapper>
        </TableWrapper>
        {currentItems.length === 0 ? (
          <NoDataMessage>고객님의 코칭 내역이 존재하지 않습니다.</NoDataMessage>
        ) : (
          <TrainerTable
            data={currentItems}
            columns={tableColumns}
            onRowClick={handleRowClick}
            fetchData={onSalarySuccess}
          />
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </ContentWrapper>

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

export default CoachMatchingList;
