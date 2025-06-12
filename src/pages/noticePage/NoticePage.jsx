import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
// FaChevronLeft, FaChevronRight는 Pagination 컴포넌트 내부에서 사용하므로 여기서는 필요 없음
import betaImg from '../../assets/beta_user_img.png'; // Header에서 사용될 이미지 (경로에 맞게 수정)
import CustomCategoryMenu from '../../components/CustomCategoryMenu'; // CustomCategoryMenu 임포트
import Pagination from '../../components/Pagination'; // Pagination 컴포넌트 임포트

// 더미 데이터 (실제로는 API 호출을 통해 받아옴)
const noticesData = [
  {
    id: 10,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 9,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 8,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 7,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 6,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 5,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 4,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 3,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 2,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  {
    id: 1,
    category: '서비스',
    title: '[안내] 블로그 앱 > 동영상 업로드 및 편집 시 대표 이미지 업로드/교체 가능하장',
    date: '2025.06.25',
  },
  // 더 많은 더미 데이터 추가 가능
];

// 페이지당 보여줄 공지사항 개수
const ITEMS_PER_PAGE = 10;

function NoticePage() {
  const [user] = useState({ name: '김현아', img: betaImg }); // Header에 전달할 사용자 정보
  const [activeCategory, setActiveCategory] = useState('전체'); // 현재 선택된 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  // 선택된 카테고리에 따라 필터링된 공지사항
  const filteredNotices =
    activeCategory === '전체' ? noticesData : noticesData.filter((notice) => notice.category === activeCategory);

  // 현재 페이지에 해당하는 공지사항 목록 계산
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  // 페이지 번호 클릭 핸들러
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <CustomCategoryMenu
            selectedCategory={activeCategory}
            onSelectCategory={(category) => {
              setActiveCategory(category);
              setCurrentPage(1); // 카테고리 변경 시 1페이지로 리셋
            }}
            // NoticePage의 카테고리명과 CustomCategoryMenu의 카테고리명이 일치하도록 categories prop 전달
            categories={[{ name: '전체' }, { name: '서비스' }, { name: '이벤트' }]}
          />
          <NoticeContent>
            <NoticeTable>
              <TableHeaders>
                <TableHeader>번호</TableHeader>
                <TableHeader>제목</TableHeader>
                <TableHeader>등록일</TableHeader>
              </TableHeaders>
              <TableBody>
                {currentNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>{notice.id}</TableCell>
                    <TableCell>
                      <NoticeTitle>{notice.title}</NoticeTitle>
                    </TableCell>
                    <TableCell>{notice.date}</TableCell>
                  </TableRow>
                ))}
                {currentNotices.length === 0 && (
                  <NoNoticeRow>
                    <TableCell colSpan="3">해당 카테고리의 공지사항이 없습니다.</TableCell>
                  </NoNoticeRow>
                )}
              </TableBody>
            </NoticeTable>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxPagesToShow={10} // 원하는 만큼 표시할 페이지 수 설정
            />
          </NoticeContent>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}

export default NoticePage;

// --- 스타일 컴포넌트 ---

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
`;

const NoticeContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['6']}; /* 카테고리 메뉴와 테이블 간격 */
`;

const NoticeTable = styled.table`
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const TableHeaders = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['2']};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};

  &:nth-child(1) {
    /* 번호 */
    width: 10%;
  }
  &:nth-child(2) {
    /* 제목 */
    width: 70%;
    text-align: left;
  }
  &:nth-child(3) {
    /* 등록일 */
    width: 20%;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['2']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray['800']};
`;

const NoticeTitle = styled.span`
  text-align: left;
  display: block; /* 제목이 길어져도 줄바꿈 되도록 */
  color: ${({ theme }) => theme.colors.gray[700]}; /* 기본 색상 설정 */
  cursor: pointer; /* 클릭 가능한 것처럼 */
  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]}; /* 호버 시 색상 변경 */
  }
`;

const NoNoticeRow = styled.tr`
  height: 150px; /* 내용이 없을 때 최소 높이 */
  td {
    color: ${({ theme }) => theme.colors.gray['500']};
    font-size: ${({ theme }) => theme.fontSizes.md};
    text-align: center;
  }
`;
