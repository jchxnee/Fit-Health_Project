import { ThemeProvider } from 'styled-components';
import './App.css';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Header from './components/Header';
import CoachSubBar from './components/CoachSubBar';
import StatusBadge from './components/StatusBadge';
import SubTable from './components/SubTable';
import Pagination from './components/Pagination';
import { useState } from 'react';

function App() {
  const tableData = [
    {
      id: 1,
      name: '전진영',
      region: '서울시 관악구',
      status: '승인대기',
      count: '0회/10회',
      re_reg: '0번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 2,
      name: '이주찬',
      region: '경기도 시흥시',
      status: '진행중',
      count: '2회/10회',
      re_reg: '2번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 3,
      name: '황인태',
      region: '경기도 화성시',
      status: '진행중',
      count: '2회/10회',
      re_reg: '2번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 4,
      name: '김현아',
      region: '파라디 섬 월마리아',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '3번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 5,
      name: '전진영',
      region: '서울시 관악구',
      status: '취소됨',
      count: '2회/10회',
      re_reg: '3번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 6,
      name: '이주찬',
      region: '경기도 시흥시',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '1번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 7,
      name: '전진영',
      region: '서울시 관악구',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '3번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 8,
      name: '전진영',
      region: '서울시 관악구',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '2번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 9,
      name: '황인태',
      region: '경기도 화성시',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '1번',
      startDate: '2025/06/04 19:00',
    },
    {
      id: 10,
      name: '전진영',
      region: '서울시 관악구',
      status: '완료됨',
      count: '2회/10회',
      re_reg: '1번',
      startDate: '2025/06/04 19:00',
    },
  ];

  const tableColumns = [
    { key: 'name', label: '이름', sortable: true },
    { key: 'region', label: '지역', sortable: true },
    { key: 'status', label: '상태', sortable: true },
    { key: 'count', label: '횟수', sortable: true },
    { key: 're_reg', label: '재등록', sortable: true },
    { key: 'startDate', label: '시작일자', sortable: true },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 예시로 총 10페이지 설정

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      console.log(`페이지 변경: ${page}`);
      // 실제 앱에서는 이 함수에서 데이터를 다시 불러오는 로직을 추가합니다.
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SubTable data={tableData} columns={tableColumns} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </ThemeProvider>
  );
}

export default App;
