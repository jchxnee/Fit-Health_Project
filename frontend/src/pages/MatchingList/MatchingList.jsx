import React, { useState, useEffect, useCallback } from 'react'; // useCallback 임포트
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import SelectBar from '../../components/selectbar/BasicSelectBar';
import UserTable from '../../components/UserTable';
import theme from '../../styles/theme';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import HistoryModal from '../../components/modal/HistoryModal';
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';

const tableColumns = [
  { key: 'trainerName', label: '코치 이름', sortable: true },
  { key: 'category', label: '카테고리', sortable: true },
  { key: 'status', label: '상태', sortable: true },
  { key: 'sessions', label: '횟수', sortable: true },
  { key: 'productPrice', label: '결제금액', sortable: true },
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #d9534f;
  border: 1px solid #d9534f;
  background-color: #f2dede;
  margin: 20px;
  border-radius: 5px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #999;
`;

const MatchingList = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const selectBarOptions = [
    { label: '전체', value: 'all' },
    { label: '완료됨', value: '완료됨' },
    { label: '진행중', value: '진행중' },
    { label: '취소됨', value: '취소됨' },
  ];

  const [currentSelection, setCurrentSelection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [matchingList, setMatchingList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const fetchMatchingList = useCallback(async () => {
    const userEmail = user?.email;

    if (!isAuthenticated || !userEmail) {
      toast.error('로그인이 필요하거나 사용자 이메일 정보를 찾을 수 없어 신청 내역을 불러올 수 없습니다.');
      navigate('/login');
      return;
    }
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENT.LIST, {
        params: {
          userEmail: userEmail,
        },
      });
      setMatchingList(response.data);
    } catch (err) {
      console.error('신청 내역을 불러오는 중 오류 발생:', err);
    }
  }, [isAuthenticated, user?.email, navigate]);

  useEffect(() => {
    fetchMatchingList();
  }, [fetchMatchingList]);

  useEffect(() => {
    let currentFilteredData = matchingList;

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
  }, [currentSelection, searchTerm, matchingList]);

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
    console.log('Selected Row Data:', rowData);

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
      <PageWrapper>
        <TitleBar title={'신청내역'} />
        <ContentWrapper>
          <TableWrapper>
            <SelectBar options={selectBarOptions} onSelect={handleSelectBarChange} initialSelected={'all'} />
            <SearchInputWrapper>
              <SearchIcon />
              <SearchInput type="text" placeholder="이름 검색" value={searchTerm} onChange={handleSearchChange} />
            </SearchInputWrapper>
            {/* 새로고침 버튼 (선택 사항, 필요 시 추가) */}
            {/* <RefreshButton onClick={fetchMatchingList} disabled={loading}>
              <FaSyncAlt />
            </RefreshButton> */}
          </TableWrapper>
          {filteredData.length === 0 ? (
            <NoDataMessage>고객님의 신청 내역이 존재하지 않습니다.</NoDataMessage>
          ) : (
            <UserTable data={currentItems} columns={tableColumns} onRowClick={handleRowClick} />
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </ContentWrapper>
      </PageWrapper>

      {selectedRowData && (
        <HistoryModal
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
