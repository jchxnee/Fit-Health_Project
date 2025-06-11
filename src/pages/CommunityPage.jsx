import React, { useState } from 'react';
import styled from 'styled-components';
import CommunityCategoryMenu from '../components/CommunityCategoryMenu';
import { FaPencilAlt } from 'react-icons/fa'; // '글쓰기' 아이콘
import Header from '../components/Header';
import Footer from '../components/Footer';
// import ProfileImg from './YourProfileImgComponent'; // 프로필 이미지 컴포넌트 경로

function CommunityPage() {
  const [user, setUser] = useState({
    name: '김현아',
    img: 'https://picsum.photos/600/400',
  });

  // 공지사항 데이터 (예시)
  const notices = [{ id: 1, title: '공지: 핏헬스 가이드라인', icon: '>', link: '#' }];

  // TOP 5 커뮤니티 글 데이터 (예시)
  const topPosts = [
    { id: 1, title: '왜진왜진 이거 살 잘빠지더라고요', views: 3500, comments: 10, likes: 20 },
    { id: 2, title: '아 그래요?', views: 3700, comments: 15, likes: 18 },
    { id: 3, title: '왜진왜진 이거 살 잘빠지더라고요', views: 3900, comments: 12, likes: 19 },
  ];

  // 최신 사진 게시글 데이터 (예시)
  const photoPosts = [
    {
      id: 1,
      img: 'https://picsum.photos/600/400',
      title: '이거 어떻게 쓰는 거예요?',
      content: '머니건 이마이건 님이 알려주셨는데 어떻게 하면 될까요??!!',
      views: 3700,
      comments: 10,
    },
    {
      id: 2,
      img: 'https://picsum.photos/600/400',
      title: '## 300',
      content: '₩R300 이치카고 벽타는 배구 그냥 몸이 이만기만합니다~~~~~!!',
      views: 3200,
      comments: 10,
    },
  ];

  // 일반 게시글 데이터 (예시)
  const generalPosts = [
    {
      id: 1,
      title: '골레 잡막이는 방법 ㅠㅠ 아시는 분',
      content: '골레가 잘 안 먹혀요. 고려아는데 잘먹는 방법이 있을까요?',
      views: 3700,
      comments: 10,
    },
    {
      id: 2,
      title: '운동해요!',
      content: '요양에 그릴리스트장에서 같이 퇴근헬스하삼! ㅎㅎ',
      views: 3700,
      comments: 10,
    },
  ];

  return (
    <PageContainer>
      <Header user={user} />
      <MainContentArea>
        <SidebarWrapper>
          <CommunityCategoryMenu /> {/* 이전에 만든 CategoryMenu 컴포넌트 */}
        </SidebarWrapper>

        <MainContentWrapper>
          {/* 커뮤니티 타이틀 및 글쓰기 버튼 */}
          <SectionHeader>
            <SectionTitle>커뮤니티</SectionTitle>
            <WriteButton>
              <FaPencilAlt />
              글쓰기
            </WriteButton>
          </SectionHeader>

          {/* 공지사항 섹션 */}
          <NoticeSection>
            {notices.map((notice) => (
              <NoticeItem key={notice.id}>
                <NoticeLabel>공지</NoticeLabel>
                <NoticeText>{notice.title}</NoticeText>
                <NoticeLink href={notice.link}>{notice.icon}</NoticeLink>
              </NoticeItem>
            ))}
          </NoticeSection>

          {/* TOP 5 커뮤니티 글 섹션 */}
          <SectionTitleSmall>TOP 5 커뮤니티 글</SectionTitleSmall>
          <TopPostsGrid>
            {topPosts.map((post) => (
              <PostCard key={post.id}>
                <PostCardTitle>{post.title}</PostCardTitle>
                <PostMeta>
                  <span>👀 {post.views}</span>
                  <span>💬 {post.comments}</span>
                  <span>❤️ {post.likes}</span>
                </PostMeta>
              </PostCard>
            ))}
          </TopPostsGrid>

          {/* 고객님들의 최신 사진 게시글 섹션 */}
          <SectionTitleSmall>고객님들의 최신 사진 게시글</SectionTitleSmall>
          <PhotoPostsGrid>
            {photoPosts.map((post) => (
              <PhotoPostCard key={post.id}>
                <PhotoPostImage src={post.img} alt={post.title} />
                <PhotoPostContent>
                  <PhotoPostTitle>{post.title}</PhotoPostTitle>
                  <PhotoPostText>{post.content}</PhotoPostText>
                  <PostMeta>
                    <span>👀 {post.views}</span>
                    <span>💬 {post.comments}</span>
                  </PostMeta>
                </PhotoPostContent>
              </PhotoPostCard>
            ))}
          </PhotoPostsGrid>

          {/* 일반 게시글 목록 */}
          <GeneralPostsContainer>
            {generalPosts.map((post) => (
              <GeneralPostItem key={post.id}>
                <GeneralPostTitle>{post.title}</GeneralPostTitle>
                <GeneralPostContent>{post.content}</GeneralPostContent>
                <PostMeta>
                  <span>👀 {post.views}</span>
                  <span>💬 {post.comments}</span>
                </PostMeta>
              </GeneralPostItem>
            ))}
          </GeneralPostsContainer>
        </MainContentWrapper>
      </MainContentArea>
      <Footer />
    </PageContainer>
  );
}

export default CommunityPage;

// --- 스타일 컴포넌트 ---

// 전체 페이지 컨테이너
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; /* 전체 콘텐츠 중앙 정렬 */
`;

// Header (Placeholder)

// 메인 콘텐츠 영역 (사이드바 + 본문)
const MainContentArea = styled.div`
  width: ${({ theme }) => theme.width.lg}; /* 1008px */
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]}; /* 사이드바와 메인 콘텐츠 사이 간격 */
  margin-top: ${({ theme }) => theme.spacing[8]}; /* 헤더 아래 여백 */
  align-items: flex-start; /* 사이드바와 메인 콘텐츠 상단 정렬 */
`;

// 왼쪽 사이드바 Wrapper (CategoryMenu를 감쌈)
const SidebarWrapper = styled.div`
  /* CategoryMenu 자체에 너비가 정의되어 있으므로 여기서는 추가 너비 지정 불필요 */
  flex-shrink: 0; /* 축소되지 않도록 함 */
`;

// 메인 콘텐츠 Wrapper
const MainContentWrapper = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[8]}; /* 내부 패딩 */
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// 섹션 헤더 (제목 + 버튼)
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']}; /* 30px */
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
`;

const WriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]}; /* 12px 16px */
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #163a82; /* 버튼 호버 색상 (button 색상보다 약간 어둡게) */
  }

  svg {
    font-size: 14px;
  }
`;

// 공지사항 섹션
const NoticeSection = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 공지 배경색 */
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NoticeItem = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const NoticeLabel = styled.span`
  background-color: ${({ theme }) => theme.colors.gray[400]}; /* 공지 라벨 배경색 */
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-right: ${({ theme }) => theme.spacing[3]};
`;

const NoticeText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  flex-grow: 1;
`;

const NoticeLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  cursor: pointer;
  margin-left: ${({ theme }) => theme.spacing[3]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// 서브 타이틀
const SectionTitleSmall = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

// TOP 5 커뮤니티 글 그리드
const TopPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PostCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  text-align: center;
`;

const PostMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};

  span {
    display: flex;
    align-items: center;
    gap: 3px; /* 아이콘과 숫자 사이 간격 */
  }
`;

// 최신 사진 게시글 그리드
const PhotoPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PhotoPostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden; /* 이미지 둥근 테두리 위해 */
`;

const PhotoPostImage = styled.img`
  width: 100%;
  height: 150px; /* 이미지 높이 고정 */
  object-fit: cover; /* 이미지가 잘리지 않고 채워지도록 */
  display: block;
`;

const PhotoPostContent = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PhotoPostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const PhotoPostText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 2줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 일반 게시글 목록
const GeneralPostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const GeneralPostItem = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const GeneralPostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const GeneralPostContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 2줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
