import { ThemeProvider } from 'styled-components';
import './App.css';
import theme from './styles/theme';
import Header from './components/Header';
import CoachSubBar from './components/CoachSubBar';
import StatusBadge from './components/StatusBadge';
import SubTable from './components/SubTable';
import Pagination from './components/Pagination';
import './App.css';
import Footer from './components/Footer';
import createGlobalStyle from 'styled-components';
import SelectBar from './components/selectbar/BasicSelectBar';
import { useState } from 'react';
import BasicList from './components/list/BasicList';
import BasicFilter from './components/filter/BasicFilter';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 1920px 푸터가 들어갈 공간을 확보하기 위해 body에 overflow-x: auto를 줄 수도 있지만,
       일반적으로는 특정 컴포넌트만 스크롤되도록 하는 것이 더 나은 사용자 경험을 제공합니다.
       여기서는 footer 자체에서 margin: 0 auto; 로 중앙 정렬만 합니다. */
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Arial, sans-serif;
  }

  main {
    flex-grow: 1;
  }
`;

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
      <GlobalStyle />
      {/* <BasicFilter filterOptions={filterOptionsConfig} onFilterChange={handleFilterChange} /> */}
      {/* <Filter /> */}
      {/* <SelectBar options={categories} onSelect={handleCategorySelect} initialSelected="전체" /> */}
      <Header />
      {/* <BasicList posts={dummyPosts} /> */}
      <Footer />
      <SubTable data={tableData} columns={tableColumns} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </ThemeProvider>
  );
  );
}

export default App;
export default App;
