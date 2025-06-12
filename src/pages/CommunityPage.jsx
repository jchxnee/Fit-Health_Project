// CommunityPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPencilAlt, FaThumbsUp, FaEye } from 'react-icons/fa'; // '글쓰기' 아이콘
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RiMessage2Fill } from 'react-icons/ri';
import betaImg from '../assets/beta_user_img.png'; // 이미지 경로에 맞게 수정
import CustomCategoryMenu from '../components/CustomCategoryMenu';
import GeneralPostsList from '../components/GeneralPostsList'; // 새로 만든 컴포넌트 import

function CommunityPage() {
  const [user] = useState({ name: '김현아', img: betaImg });
  const [activeCategory, setActiveCategory] = useState('전체');

  // 공지사항 데이터 (예시)
  const notices = [{ id: 1, title: '공지: 핏헬스 가이드라인', icon: '>', link: '#' }];

  const communityCategories = [{ name: '전체' }, { name: '운동해요!' }, { name: '궁금해요!' }, { name: '소통해요!' }];

  // TOP 5 커뮤니티 글 데이터 (예시)
  const topPosts = [
    { id: 1, title: '왜진왜진 이거 살 잘빠지더라고요', views: 3500, comments: 10 },
    { id: 2, title: '아 그래요?', views: 3700, comments: 15 },
    { id: 3, title: '와진짜 이거 살 잘빠지더라고요', views: 3900, comments: 12 },
  ];

  // 최신 사진 게시글 데이터 (예시)
  const photoPosts = [
    {
      id: 1,
      img: 'https://picsum.photos/600/400',
      title: '이거 어떻게 쓰는 거예요?',
      content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
      heart: 3700,
      comments: 10,
    },
    {
      id: 2,
      img: 'https://picsum.photos/600/400',
      title: '비타 300',
      content: '비타300 이거 먹고 변비도 낫구 그냥 몸이 건강한 기분입니다~~!!',
      heart: 3200,
      comments: 10,
    },
  ];

  // 일반 게시글 데이터 (예시)
  const generalPosts = [
    {
      id: 1,
      title: '광배 잘먹이는 방법..ㅠㅠ 아시는분',
      content: '광배가 잘 안먹어요... 안먹을때 잘 먹게 하는 방법이 있을까요?',
      category: '궁금해요!',
      timeAgo: '5분 전',
      heart: 3700,
      comments: 10,
    },
    {
      id: 2,
      title: '운동해요!',
      content: '요 앞에 고릴라헬스장에서 같이 퇴근헬스하실분!! ㅎㅎ',
      category: '궁금해요!',
      timeAgo: '5분 전',
      heart: 3700,
      comments: 10,
    },
  ];

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <MainContentArea>
          <SidebarWrapper>
            <CustomCategoryMenu
              categories={communityCategories}
              selectedCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
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
            <SectionTitleSmall>TOP 5 커뮤니티 글🔥</SectionTitleSmall>
            <TopPostsGrid>
              {topPosts.map((post) => (
                <PostCard key={post.id}>
                  <PostCardTitle>{post.title}</PostCardTitle>
                  <PostMeta>
                    <span>
                      <FaEye /> {post.views}
                    </span>
                    <span>
                      <RiMessage2Fill /> {post.comments}
                    </span>
                  </PostMeta>
                </PostCard>
              ))}
            </TopPostsGrid>

            {/* 고객님들의 최신 사진 게시글 섹션 */}
            <SectionTitleMini>고객님들의 최신 사진 게시글</SectionTitleMini>
            <PhotoPostsGrid>
              {photoPosts.map((post) => (
                <PhotoPostCard key={post.id}>
                  <PhotoPostImage src={post.img} alt={post.title} />
                  <PhotoPostContent>
                    <PhotoPostTitle>{post.title}</PhotoPostTitle>
                    <PhotoPostText>{post.content}</PhotoPostText>
                    <PostMeta>
                      <span>
                        {' '}
                        <FaThumbsUp /> {post.heart}
                      </span>
                      <span>
                        <RiMessage2Fill /> {post.comments}
                      </span>
                    </PostMeta>
                  </PhotoPostContent>
                </PhotoPostCard>
              ))}
            </PhotoPostsGrid>
            <GeneralPostsList posts={generalPosts} />
          </MainContentWrapper>
        </MainContentArea>
      </PageContainer>
      <Footer />
    </>
  );
}

export default CommunityPage;

// --- CommunityPage에 남겨둘 스타일 컴포넌트 ---
// 일반 게시글 목록 관련 스타일은 GeneralPostsList.jsx로 이동했습니다.
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; /* 전체 콘텐츠 중앙 정렬 */
`;

const MainContentArea = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  align-items: flex-start;
`;

const SidebarWrapper = styled.div`
  flex-shrink: 0;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

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

const SectionTitleSmall = styled.h2`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const SectionTitleMini = styled.h2`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const TopPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PostCard = styled.div`
  background-color: #e5ebff;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PostCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: end;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};

  span {
    display: flex;
    align-items: center;
    gap: 3px; /* 아이콘과 숫자 사이 간격 */
  }
`;

const PhotoPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[10]};
  gap: ${({ theme }) => theme.spacing[10]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PhotoPostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  overflow: hidden; /* 이미지 둥근 테두리 위해 */
`;

const PhotoPostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const PhotoPostContent = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PhotoPostTitle = styled.h3`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const PhotoPostText = styled.p`
  text-align: start;
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
