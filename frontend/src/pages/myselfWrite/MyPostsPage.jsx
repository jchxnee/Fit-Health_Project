// src/pages/MyPostsPage.jsx

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

// --- 스타일 컴포넌트 (생략 - 기존과 동일) ---
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
  text-decoration: none;
`;

function MyPostsPage() {
  const { user, isAuthenticated } = useUserStore();

  const [allPosts, setAllPosts] = useState([]);
  const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'latest',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      label: '정렬',
      key: 'sort',
      options: [
        { label: '최신순', value: 'latest' },
        { label: '오래된순', value: 'oldest' },
        { label: '조회순', value: 'views' },
      ],
    },
  ];

  const fetchAllMyPosts = useCallback(async () => {
    if (!isAuthenticated || !user || !user.email) {
      setLoading(false);
      setError('로그인 정보가 없거나 유효하지 않습니다.');
      setAllPosts([]);
      setFilteredAndSortedPosts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(API_ENDPOINTS.BOARD.MYPOSTS, {
        params: {
          userEmail: user.email,
        },
      });

      const fetchedPosts = response.data;
      setAllPosts(fetchedPosts || []);
      setFilteredAndSortedPosts(fetchedPosts || []);
    } catch (err) {
      console.error('내 게시물 데이터를 불러오는 중 오류 발생:', err);
      setError(err.response?.data?.message || '내 게시물을 불러오는데 실패했습니다.');
      setAllPosts([]);
      setFilteredAndSortedPosts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchAllMyPosts();
  }, [fetchAllMyPosts]);

  // **MyBoardGetDto 필드명에 맞춰 필터링 및 정렬 로직 수정**
  useEffect(() => {
    if (loading || !allPosts) {
      return;
    }

    let tempPosts = [...allPosts];

    // 검색 필터링 (board_title, board_content, user_name, board_category_name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tempPosts = tempPosts.filter(
        (post) =>
          (post.board_title && post.board_title.toLowerCase().includes(searchTerm)) ||
          (post.board_content && post.board_content.toLowerCase().includes(searchTerm)) ||
          (post.user_name && post.user_name.toLowerCase().includes(searchTerm)) || // 작성자 이름 검색 추가
          (post.board_category_name && post.board_category_name.toLowerCase().includes(searchTerm))
      );
    }

    // 카테고리 필터링 (board_category_name)
    if (filters.category !== 'all') {
      tempPosts = tempPosts.filter((post) => post.board_category_name === filters.category);
    }

    // 정렬 (created_date, count)
    tempPosts.sort((a, b) => {
      switch (filters.sort) {
        case 'latest':
          // created_date는 LocalDateTime 문자열이므로 Date 객체로 변환하여 비교
          return new Date(b.created_date) - new Date(a.created_date);
        case 'oldest':
          return new Date(a.created_date) - new Date(b.created_date);
        case 'views':
          return (b.count || 0) - (a.count || 0); // 조회수는 'count' 필드
        default:
          return 0;
      }
    });

    setFilteredAndSortedPosts(tempPosts);
    setCurrentPage(1);
  }, [filters, allPosts, loading]); // allPosts 의존성 추가 (데이터 로드 후 필터링/정렬)

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

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
            currentCategory={filters.category}
            currentSort={filters.sort}
          />
        </Container>

        {currentPosts.length > 0 ? (
          <GeneralPostsList posts={currentPosts} />
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
