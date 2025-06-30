// src/pages/MyCommentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BasicFilter from '../../components/filter/BasicFilter';
import CommentsList from '../../components/CommentsList';
import TitleBar from '../../components/TitleBar';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';
import useUserStore from '../../store/useUserStore';

// --- 임시 데이터는 컴포넌트 외부로 이동 ---
// 이 데이터는 이제 사용되지 않지만, 컴포넌트 로직에는 영향을 주지 않습니다.
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
  align-items: center;

  button {
    outline: none;
  }
`;

const MainContentArea = styled.div`
  width: ${({ theme }) => theme.width.lg};
  max-width: 90%;
  margin: 0 auto;
  flex-grow: 1;
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

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function MyCommentsPage() {
  const { user } = useUserStore();

  const [myComments, setMyComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'latest',
  });

  const location = useLocation();

  // 필터 옵션
  // 백엔드에서 오는 카테고리 이름과 정확히 일치해야 합니다.
  // 예를 들어, 백엔드에서 "운동해요"로 온다면 여기에 "운동해요"로 맞춰주세요.
  const filterOptions = [
    {
      label: '전체',
      key: 'category',
      options: [
        { label: '전체', value: 'all' },
        { label: '운동해요!', value: '운동해요!' }, // 백엔드 실제 값 확인 필요
        { label: '궁금해요!', value: '궁금해요!' }, // 백엔드 실제 값 확인 필요
        { label: '소통해요!', value: '소통해요!' }, // 백엔드 실제 값 확인 필요
      ],
    },
    {
      label: '최신순',
      key: 'sort',
      options: [
        { label: '최신순', value: 'latest' },
        { label: '오래된순', value: 'oldest' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 내 댓글 데이터를 불러오는 useEffect 훅
  useEffect(() => {
    const fetchComments = async () => {
      if (!user || !user.email) {
        setError('로그인 정보가 없거나 유효하지 않습니다.');
        setLoading(false);
        setMyComments([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(API_ENDPOINTS.COMMENT.MYCOMMENTS, {
          params: {
            userEmail: user.email,
          },
        });
        // API 응답 데이터가 MyCommentGetDto 배열일 것입니다.
        // MyCommentGetDto에 board_category_name과 board_title 필드가 포함되어야 합니다.
        setMyComments(response.data);
        // 초기에는 필터링 없이 전체 데이터를 표시합니다.
        setFilteredComments(response.data);
      } catch (err) {
        console.error('내 댓글 데이터를 불러오는 중 오류 발생:', err);
        setError(err.response?.data?.message || '내 댓글을 불러오는데 실패했습니다.');
        setMyComments([]);
        setFilteredComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [user]); // user 객체가 변경될 때마다 (특히 user.email) API를 재호출

  // 필터링 및 정렬 로직
  useEffect(() => {
    // API 로딩 중이거나, myComments가 아직 불러와지지 않았다면 필터링을 건너뜁니다.
    // 또한, 에러 상태일 때도 필터링을 하지 않습니다.
    if (loading || !myComments || myComments.length === 0) {
      // 로딩이 완료되었는데 myComments가 비어있고 에러가 없다면,
      // API에서 빈 배열을 반환했을 수 있으므로 filteredComments도 비워줍니다.
      if (!loading && !error && myComments && myComments.length === 0) {
        setFilteredComments([]);
      }
      return;
    }

    let tempComments = [...myComments]; // API에서 불러온 데이터를 기반으로 필터링

    // 검색 필터링
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tempComments = tempComments.filter(
        (comment) =>
          // 백엔드 MyCommentGetDto의 필드 이름에 맞게 수정
          (comment.board_title && comment.board_title.toLowerCase().includes(searchTerm)) || // 게시글 제목 검색
          (comment.comment_content && comment.comment_content.toLowerCase().includes(searchTerm)) || // 댓글 내용 검색
          (comment.board_category_name && comment.board_category_name.toLowerCase().includes(searchTerm)) // 게시글 카테고리 검색
      );
    }

    // 카테고리 필터링
    if (filters.category !== 'all') {
      // 백엔드 MyCommentGetDto의 필드 이름에 맞게 수정
      tempComments = tempComments.filter((comment) => comment.board_category_name === filters.category);
    }

    // 정렬
    tempComments.sort((a, b) => {
      if (filters.sort === 'latest') {
        // created_date는 LocalDateTime 문자열이므로 Date 객체로 변환하여 비교
        return new Date(b.created_date) - new Date(a.created_date);
      } else if (filters.sort === 'oldest') {
        return new Date(a.created_date) - new Date(b.created_date);
      } else if (filters.sort === 'likes') {
        // MyCommentGetDto에 좋아요 필드(예: board_likes)가 있다면 사용
        // 현재 DTO에 없으므로, 이 부분은 백엔드에 추가해야 작동합니다.
        // 임시로 0을 반환하여 정렬에 영향을 주지 않도록 하거나,
        // 해당 필드가 없을 경우 좋아요순 정렬 옵션을 숨기는 것이 좋습니다.
        // return b.board_likes - a.board_likes; // 이 필드가 MyCommentGetDto에 추가되어야 합니다.
        return 0; // 임시: 좋아요순 정렬은 현재 작동하지 않음
      }
      return 0;
    });

    setFilteredComments(tempComments);
  }, [filters, myComments, loading, error]); // myComments, loading, error도 의존성 배열에 추가

  // 로딩 및 에러 UI
  if (loading) {
    return (
      <PageContainer>
        <div>댓글을 불러오는 중...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div>오류 발생: {error}</div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <MainContentArea>
          <TitleBar title="내가 작성한 게시물/댓글" />
          <Container>
            <TabContainer>
              <TabButton to="/myPostsPage" $active={location.pathname === '/myPostsPage'}>
                나의 게시물
              </TabButton>
              <TabButton to="/myCommentsPage" $active={location.pathname === '/myCommentsPage'}>
                나의 댓글
              </TabButton>{' '}
            </TabContainer>
            <BasicFilter filterOptions={filterOptions} onFilterChange={handleFilterChange} />
          </Container>

          {/* 댓글이 없을 경우 메시지 표시 */}
          {filteredComments.length === 0 && !loading && !error ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>작성한 댓글이 없습니다.</p>
            </div>
          ) : (
            <CommentsList comments={filteredComments} />
          )}
        </MainContentArea>
      </PageContainer>
    </>
  );
}

export default MyCommentsPage;
