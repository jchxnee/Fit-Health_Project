import React, { useState, useEffect } from 'react'; // useEffect import 추가
import styled from 'styled-components';
import Header from '../../components/Header'; // Header 컴포넌트 경로에 맞게 수정
import Footer from '../../components/Footer'; // Footer 컴포넌트 경로에 맞게 수정
import betaImg from '../../assets/beta_user_img.png'; // 더미 사용자 프로필 이미지 및 후기 내 등 사진으로 사용
import GeneralPostsList from '../../components/GeneralPostsList';
import BasicFilter from '../../components/filter/BasicFilter';
import TitleBar from '../../components/TitleBar';

// --- 임시 데이터는 컴포넌트 외부로 이동 ---
const MY_POSTS_DATA = [
  {
    id: 1,
    category: '운동해요!',
    title: '이거 어떻게 쓰는 거예요?',
    content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
    heart: 20,
    comments: 2,
    timeAgo: '2025.06.07',
  },
  {
    id: 2,
    category: '운동해요!',
    title: '이거 어떻게 쓰는 거예요?',
    content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
    heart: 20,
    comments: 2,
    timeAgo: '2025.06.07',
  },
  {
    id: 3,
    category: '운동해요!',
    title: '이거 어떻게 쓰는 거예요?',
    content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
    heart: 20,
    comments: 2,
    timeAgo: '2025.06.07',
  },
  {
    id: 4,
    category: '운동해요!',
    title: '이거 어떻게 쓰는 거예요?',
    content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
    heart: 20,
    comments: 2,
    timeAgo: '2025.06.07',
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.gray[700])};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function MyPostsPage() {
  const [user] = useState({ name: '김현아', img: betaImg }); // 실제 이미지 경로로 수정
  const [filteredPosts, setFilteredPosts] = useState([]);
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
        { label: '운동해요!', value: '운동해요!' },
        { label: '궁금해요!', value: '궁금해요!' },
        { label: '소통해요!', value: '소통해요!' },
      ],
    },
    {
      label: '최신순',
      key: 'sort',
      options: [
        { label: '최신순', value: 'latest' },
        { label: '오래된순', value: 'oldest' },
        { label: '조회순', value: 'views' },
        { label: '댓글순', value: 'comments' },
      ],
    },
  ];

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // 필터링 및 정렬 로직
  useEffect(() => {
    let tempPosts = [...MY_POSTS_DATA]; // 컴포넌트 외부에서 정의된 상수 사용

    // 검색 필터링
    if (filters.search) {
      tempPosts = tempPosts.filter(
        (post) =>
          post.title.includes(filters.search) ||
          post.content.includes(filters.search) ||
          post.category.includes(filters.search)
      );
    }

    // 카테고리 필터링
    if (filters.category !== 'all') {
      tempPosts = tempPosts.filter((post) => post.category === filters.category);
    }

    // 정렬
    tempPosts.sort((a, b) => {
      if (filters.sort === 'latest') {
        // 실제 날짜 객체로 변환하여 비교
        return new Date(b.timeAgo) - new Date(a.timeAgo);
      } else if (filters.sort === 'oldest') {
        // 실제 날짜 객체로 변환하여 비교
        return new Date(a.timeAgo) - new Date(b.timeAgo);
      } else if (filters.sort === 'views') {
        return b.heart - a.heart; // 예시로 heart를 조회수로 사용
      } else if (filters.sort === 'comments') {
        return b.comments - a.comments;
      }
      return 0;
    });

    setFilteredPosts(tempPosts);
  }, [filters]); // 의존성 배열에서 MY_POSTS_DATA 제거

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <MainContentArea>
          <TitleBar title="내가 작성한/댓글" />
          <Container>
            <TabContainer>
              <TabButton $active={true}>나의 게시물</TabButton>
              <TabButton>나의 댓글</TabButton> {/* 나의 댓글 페이지로 이동 */}
            </TabContainer>
            <BasicFilter filterOptions={filterOptions} onFilterChange={handleFilterChange} />
          </Container>

          {/* 게시물 목록 */}
          <GeneralPostsList posts={filteredPosts} />
        </MainContentArea>
      </PageContainer>
      <Footer />
    </>
  );
}

export default MyPostsPage;
