import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import GeneralPostsList from '../../components/GeneralPostsList';
import BasicFilter from '../../components/filter/BasicFilter';
import TitleBar from '../../components/TitleBar';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';
import useUserStore from '../../store/useUserStore';

// --- 스타일 컴포넌트 ---
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  input,
  a,
  button {
    outline: none;
  }
`;

const MainContentArea = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  flex-shrink: 0;
  flex-grow: 0;
`;

const TabButton = styled(Link)`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.gray[700])};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  transition: all 0.2s ease-in-out;
`;

// 디바운싱을 위한 커스텀 훅
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function MyPostsPage() {
  const { user, isAuthenticated } = useUserStore();

  const [posts, setPosts] = useState([]); // 필터링된 게시물 목록
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'latest', // 백엔드 정렬 파라미터와 맞춤
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 검색어 디바운싱 (500ms 지연)
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // 필터 옵션
  const filterOptions = [
    {
      label: '전체',
      key: 'category',
      options: [
        { label: '전체', value: 'all' },
        { label: '운동해요!', value: '운동해요!' },
        { label: '궁금해요!', value: '궁금해요!' },
        { label: '소통해요!', value: '소통해요!' },
      ],
    },
    {
      label: '정렬', // 레이블을 '최신순'이 아닌 '정렬'로 변경하거나 첫 번째 옵션으로 '최신순'을 기본 선택되도록 할 수 있음
      key: 'sort',
      options: [
        { label: '최신순', value: 'latest' },
        { label: '오래된순', value: 'oldest' },
        { label: '조회순', value: 'views' },
      ],
    },
  ];

  // 백엔드에서 데이터를 가져오는 함수
  const fetchMyPosts = useCallback(async () => {
    if (!isAuthenticated || !user || !user.email) {
      setLoading(false);
      setError('로그인 정보가 없거나 유효하지 않습니다.');
      setPosts([]);
      setTotalPostsCount(0);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 백엔드 API 호출 시 필터 및 페이지 정보 전달
      const response = await api.get(API_ENDPOINTS.BOARD.MYPOSTS, {
        params: {
          userEmail: user.email,
          category: filters.category,
          search: debouncedSearchTerm,
          page: currentPage - 1, // 백엔드 페이지는 0부터 시작
          size: postsPerPage,
          // 백엔드 sort 파라미터는 '필드명,정렬방식' 형태
          sort: (() => {
            switch (filters.sort) {
              case 'latest':
                return 'createdDate,desc';
              case 'oldest':
                return 'createdDate,asc';
              case 'views':
                return 'count,desc';
              default:
                return 'createdDate,desc';
            }
          })(),
        },
      });

      const fetchedPageResponse = response.data;
      setPosts(fetchedPageResponse.content || []);
      setTotalPostsCount(fetchedPageResponse.totalElements || 0);
      setTotalPages(fetchedPageResponse.totalPages || 0);
    } catch (err) {
      console.error('내 게시물 데이터를 불러오는 중 오류 발생:', err);
      setError(err.response?.data?.message || '내 게시물을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, filters, debouncedSearchTerm, currentPage, postsPerPage]);

  // 필터, 검색어, 페이지 변경 시 데이터 다시 로딩
  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <PageContainer>
        <MainContentArea>
          <TitleBar title="내가 작성한 게시물/댓글" />
          <div style={{ textAlign: 'center', padding: '20px' }}>내 게시물을 불러오는 중입니다...</div>
        </MainContentArea>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <MainContentArea>
          <TitleBar title="내가 작성한 게시물/댓글" />
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>
        </MainContentArea>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContentArea>
        <TitleBar title="내가 작성한 게시물/댓글" />
        <Container>
          <TabContainer>
            <TabButton $active={true} to="/myPostsPage">
              나의 게시물
            </TabButton>
            <TabButton $active={false} to="/myCommentsPage">
              나의 댓글
            </TabButton>
          </TabContainer>
          <BasicFilter
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            currentSearch={filters.search}
            currentCategory={filters.category} // BasicFilter에 category 값 전달
            currentSort={filters.sort} // BasicFilter에 sort 값 전달
          />
        </Container>

        {posts.length > 0 ? (
          <GeneralPostsList posts={posts} />
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            {filters.search || filters.category !== 'all'
              ? '검색 조건에 맞는 게시물이 없습니다.'
              : '작성한 게시물이 없습니다.'}
          </div>
        )}

        {totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </MainContentArea>
    </PageContainer>
  );
}

export default MyPostsPage;
