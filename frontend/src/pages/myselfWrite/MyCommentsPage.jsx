// src/pages/MyCommentsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BasicFilter from '../../components/filter/BasicFilter'; // BasicFilter 컴포넌트 경로에 맞게 수정
import CommentsList from '../../components/CommentsList'; // MyCommentsList로 변경
import TitleBar from '../../components/TitleBar';
import { Link } from 'react-router-dom';

// --- 임시 데이터는 컴포넌트 외부로 이동 ---
const MY_COMMENTS_DATA = [
  {
    id: 1,
    postId: 101, // 댓글이 달린 게시글 ID
    category: '궁금해요~',
    postTitle: '이거 어떻게 쓰는 거예요?',
    content: '내 악력기가 있습니다~ 많이 연습하세요~!!',
    likes: 12,
    timeAgo: '2025.05.31',
  },
  {
    id: 2,
    postId: 102,
    category: '궁금해요~',
    postTitle: '이거 어떻게 쓰는게 맞는대요?',
    content: '음... 그렇게 쓰고 싶음 쓰세요~',
    likes: 5,
    timeAgo: '2025.05.27',
  },
  {
    id: 3,
    postId: 103,
    category: '운동해요~',
    postTitle: '하체 운동을 해도 살이 안빠져요..',
    content: '님 먹는걸 보세요 ㅋㅋ;;',
    likes: 8,
    timeAgo: '2025.05.21',
  },
  {
    id: 4,
    postId: 104,
    category: '운동해요~',
    postTitle: '요즘 등운동 할때 전완근이 너무 털리네요..',
    content: '턱걸이 님 힙이 털리는거 보면 낫죠',
    likes: 3,
    timeAgo: '2025.05.15',
  },
  {
    id: 5,
    postId: 105,
    category: '소통해요~',
    postTitle: '저녁 7시에 운동가실분 구합니다!!',
    content: '님 남자 가야돼요 ㅋㅋㅋ',
    likes: 7,
    timeAgo: '2025.05.15',
  },
];

// --- 스타일 컴포넌트 ---
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; /* 자식 요소들을 가로축(수평)으로 가운데 정렬 */

  button {
    outline: none;
  }
`;

const MainContentArea = styled.div`
  width: ${({ theme }) => theme.width.lg};
  max-width: 90%; /* 화면 너비에 따라 조절 */
  margin: 0 auto; /* 상단 여백 및 가운데 정렬 */
  flex-grow: 1; /* 남은 세로 공간을 채우도록 설정 */
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  background-color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.width.lg}) {
    max-width: 95%;
    padding: ${({ theme }) => theme.spacing[6]};
  }

  @media (max-width: ${({ theme }) => theme.width.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// SectionTitle은 TitleBar를 사용한다면 제거하거나 TitleBar 내부에서 사용
// const SectionTitle = styled.h1`
//   font-size: ${({ theme }) => theme.fontSizes['2xl']};
//   color: ${({ theme }) => theme.colors.gray[900]};
//   font-weight: ${({ theme }) => theme.fontWeights.bold};
//   margin-bottom: ${({ theme }) => theme.spacing[4]};
//   text-align: start;
// `;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* BasicFilter가 줄바꿈될 때를 대비하여 flex-wrap 추가 */
  gap: ${({ theme }) => theme.spacing[2]}; /* 자식 요소 사이 간격 */
  align-items: flex-end; /* 탭과 필터가 하단에 정렬되도록 */

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

function MyCommentsPage() {
  const [filteredComments, setFilteredComments] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'latest',
  });

  // 필터 옵션
  const filterOptions = [
    {
      label: '전체',
      key: 'category',
      options: [
        { label: '전체', value: 'all' },
        { label: '운동해요!', value: '운동해요~' },
        { label: '궁금해요!', value: '궁금해요~' },
        { label: '소통해요!', value: '소통해요~' },
      ],
    },
    {
      label: '최신순',
      key: 'sort',
      options: [
        { label: '최신순', value: 'latest' },
        { label: '오래된순', value: 'oldest' },
        { label: '좋아요순', value: 'likes' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 필터링 및 정렬 로직
  useEffect(() => {
    let tempComments = [...MY_COMMENTS_DATA];

    // 검색 필터링
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tempComments = tempComments.filter(
        (comment) =>
          comment.postTitle.toLowerCase().includes(searchTerm) ||
          comment.content.toLowerCase().includes(searchTerm) ||
          comment.category.toLowerCase().includes(searchTerm)
      );
    }

    // 카테고리 필터링
    if (filters.category !== 'all') {
      tempComments = tempComments.filter((comment) => comment.category === filters.category);
    }

    // 정렬
    tempComments.sort((a, b) => {
      if (filters.sort === 'latest') {
        return new Date(b.timeAgo) - new Date(a.timeAgo);
      } else if (filters.sort === 'oldest') {
        return new Date(a.timeAgo) - new Date(b.timeAgo);
      } else if (filters.sort === 'likes') {
        return b.likes - a.likes;
      }
      return 0;
    });

    setFilteredComments(tempComments);
  }, [filters]);

  return (
    <>
      <PageContainer>
        <MainContentArea>
          <TitleBar title="내가 작성한 게시물/댓글" />
          <Container>
            <TabContainer>
              <TabButton to="/myPostsPage">나의 게시물</TabButton>
              <TabButton style={{ borderBottom: '1px solid #6b7280' }} to="/myCommentsPage">
                나의 댓글
              </TabButton>{' '}
              {/* 나의 댓글 페이지로 이동 */}
            </TabContainer>
            <BasicFilter filterOptions={filterOptions} onFilterChange={handleFilterChange} />
          </Container>

          <CommentsList comments={filteredComments} />
        </MainContentArea>
      </PageContainer>
    </>
  );
}

export default MyCommentsPage;
