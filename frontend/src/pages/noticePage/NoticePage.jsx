import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { API_ENDPOINTS } from '../../api/config';
import api from '../../api/axios';

// 페이지당 보여줄 공지사항 개수
const ITEMS_PER_PAGE = 10;

function NoticePage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1); // 1-based 페이지 번호
  const [notices, setNotices] = useState([]); // 실제 공지사항 데이터
  const [totalNoticeCount, setTotalNoticeCount] = useState(0); // 전체 공지사항 개수 (totalElements)
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const navigate = useNavigate();
  const { user } = useUserStore();

  // 공지사항 데이터 불러오기
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          // 백엔드는 0-based 페이지를 기대하므로 currentPage에서 1을 뺌
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          sort: 'createdDate,desc', // 백엔드 @PageableDefault의 sort와 direction에 맞춤
          category: activeCategory,
        };

        // API_ENDPOINTS.NOTICE.LIST는 "/api/notice/all"로 가정합니다.
        const response = await api.get(API_ENDPOINTS.NOTICE.LIST, { params });

        // 백엔드 PageResponse DTO 구조에 맞춰 데이터 설정
        setNotices(response.data.content || []); // PageResponse의 content 필드
        setTotalNoticeCount(response.data.totalElements || 0); // PageResponse의 totalElements 필드
      } catch (err) {
        console.error('공지사항 데이터를 불러오는 데 실패했습니다:', err);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        setNotices([]); // 에러 발생 시 목록 초기화
        setTotalNoticeCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage, activeCategory]); // currentPage 또는 activeCategory 변경 시 다시 API 호출

  // totalPages는 totalNoticeCount와 ITEMS_PER_PAGE를 기반으로 계산
  const totalPages = Math.ceil(totalNoticeCount / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 리셋
  };

  const handleRegisterClick = () => {
    navigate('/NoticePostCreationPage'); // 공지사항 작성 페이지 경로
  };

  // NoticeDetailPage로 이동하는 함수 (공지사항 제목 클릭 시)
  const handleNoticeClick = (noticeNo) => {
    console.log('클릭된 공지사항 번호:', noticeNo); // 이 부분을 추가
    navigate(`/NoticeDetailPage/${noticeNo}`); // 실제 상세 페이지 경로에 맞게 수정
  };

  // 날짜 포맷팅 함수 (선택 사항: 필요에 따라 다른 라이브러리 사용 가능)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR'); // YYYY. MM. DD 형식
  };

  return (
    <>
      <PageContainer>
        <TitleBar title="공지사항" />
        <RightDiv>
          {user && user.grade === 'A' && <RegisterButton onClick={handleRegisterClick}>등록</RegisterButton>}
        </RightDiv>
        <ContentWrapper>
          <CustomCategoryMenu
            selectedCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
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
                {loading && (
                  <NoNoticeRow>
                    <TableCell colSpan="3">공지사항을 불러오는 중...</TableCell>
                  </NoNoticeRow>
                )}
                {error && (
                  <NoNoticeRow>
                    <TableCell colSpan="3">{error}</TableCell>
                  </NoNoticeRow>
                )}
                {!loading && !error && notices.length === 0 && (
                  <NoNoticeRow>
                    <TableCell colSpan="3">해당 카테고리의 공지사항이 없습니다.</TableCell>
                  </NoNoticeRow>
                )}
                {!loading &&
                  !error &&
                  notices.length > 0 &&
                  notices.map((notice) => (
                    // 백엔드 DTO의 필드명에 맞게 key와 값을 변경
                    <TableRow key={notice.notice_no}>
                      <TableCell>{notice.notice_no}</TableCell>
                      <TableCell>
                        <NoticeTitle onClick={() => handleNoticeClick(notice.notice_no)}>
                          {notice.notice_title}
                        </NoticeTitle>
                      </TableCell>
                      <TableCell>{formatDate(notice.created_date)}</TableCell> {/* 날짜 포맷팅 */}
                    </TableRow>
                  ))}
              </TableBody>
            </NoticeTable>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxPagesToShow={10}
            />
          </NoticeContent>
        </ContentWrapper>
      </PageContainer>
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
  gap: ${({ theme }) => theme.spacing['6']};
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
    width: 10%;
  }
  &:nth-child(2) {
    width: 70%;
    text-align: left;
  }
  &:nth-child(3) {
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
  display: block;
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const NoNoticeRow = styled.tr`
  height: 150px;
  td {
    color: ${({ theme }) => theme.colors.gray['500']};
    font-size: ${({ theme }) => theme.fontSizes.md};
    text-align: center;
  }
`;

const RegisterButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
const RightDiv = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  justify-content: flex-end;
  align-self: center;
`;
