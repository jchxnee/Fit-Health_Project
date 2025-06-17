// CommunityPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPencilAlt, FaThumbsUp, FaEye } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import GeneralPostsList from '../../components/GeneralPostsList';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import Pagination from '../../components/Pagination';

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const notices = [{ id: 1, title: '공지: 핏헬스 가이드라인', icon: '>', link: '#' }];
  const communityCategories = [{ name: '전체' }, { name: '운동해요!' }, { name: '궁금해요!' }, { name: '소통해요!' }];

  const topPosts = [
    { id: 1, title: '왜진왜진 이거 살 잘빠지더라고요', views: 3500, comments: 10 },
    { id: 2, title: '아 그래요?', views: 3700, comments: 15 },
    { id: 3, title: '와진짜 이거 살 잘빠지더라고요', views: 3900, comments: 12 },
  ];

  const photoPosts = [
    {
      id: 1,
      img: 'https://picsum.photos/300/200?random=1',
      title: '이거 어떻게 쓰는 거예요?',
      content: '아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력키우기인가요?',
      heart: 3700,
      comments: 10,
    },
    {
      id: 2,
      img: 'https://picsum.photos/300/200?random=2',
      title: '비타 300',
      content: '비타300 이거 먹고 변비도 낫구 그냥 몸이 건강한 기분입니다~~!!',
      heart: 3200,
      comments: 10,
    },
    {
      id: 3,
      img: 'https://picsum.photos/300/200?random=3',
      title: '새 운동복 자랑',
      content: '새로 산 운동복인데 착용감이 정말 좋네요!',
      heart: 1500,
      comments: 5,
    },
    {
      id: 4,
      img: 'https://picsum.photos/300/200?random=4',
      title: '헬스장 풍경',
      content: '오늘도 운동하기 좋은 날씨! 다들 득근하세요!',
      heart: 2000,
      comments: 7,
    },
  ];

  const allGeneralPosts = [
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
      title: '요 앞에 고릴라헬스장에서 같이 퇴근헬스하실분!! ㅎㅎ',
      content: '같이 운동할 분 찾아요!',
      category: '운동해요!',
      timeAgo: '10분 전',
      heart: 3200,
      comments: 8,
    },
    {
      id: 3,
      title: '닭가슴살 샐러드 맛집 추천해주세요',
      content: '맛있고 질리지 않는 닭가슴살 샐러드 어디 없나요?',
      category: '궁금해요!',
      timeAgo: '15분 전',
      heart: 2500,
      comments: 12,
    },
    {
      id: 4,
      title: '요즘 핫한 운동 루틴 같이 공유해요!',
      content: '저는 요즘 이 루틴으로 운동 중인데 효과 좋아요!',
      category: '운동해요!',
      timeAgo: '20분 전',
      heart: 4000,
      comments: 20,
    },
    {
      id: 5,
      title: '점심 뭐 먹을지 고민이네요',
      content: '운동 후에는 뭘 먹어야 할까요?',
      category: '소통해요!',
      timeAgo: '25분 전',
      heart: 1800,
      comments: 5,
    },
    {
      id: 6,
      title: '새로운 헬스장 오픈! 후기 남겨요',
      content: '시설도 좋고 트레이너분들도 친절하시네요.',
      category: '소통해요!',
      timeAgo: '30분 전',
      heart: 3000,
      comments: 15,
    },
    {
      id: 7,
      title: '운동하기 좋은 계절이네요',
      content: '날씨도 좋고 운동하기 딱이네요.',
      category: '운동해요!',
      timeAgo: '35분 전',
      heart: 2800,
      comments: 7,
    },
    {
      id: 8,
      title: 'PT 어디서 받아야 하나요?',
      content: '초보인데 PT를 받고 싶은데 어디가 좋을까요?',
      category: '궁금해요!',
      timeAgo: '40분 전',
      heart: 2200,
      comments: 9,
    },
    {
      id: 9,
      title: '오늘 운동 인증샷!',
      content: '오늘도 뿌셨다!',
      category: '소통해요!',
      timeAgo: '45분 전',
      heart: 4500,
      comments: 25,
    },
    {
      id: 10,
      title: '운동 후 단백질 섭취는 필수!',
      content: '어떤 단백질 보충제가 좋을까요?',
      category: '궁금해요!',
      timeAgo: '50분 전',
      heart: 2000,
      comments: 6,
    },
    {
      id: 11,
      title: '러닝 크루 찾습니다!',
      content: '같이 한강에서 러닝하실 분!',
      category: '운동해요!',
      timeAgo: '1시간 전',
      heart: 3100,
      comments: 11,
    },
    {
      id: 12,
      title: '식단 공유해요',
      content: '저는 이렇게 식단 관리하고 있어요.',
      category: '소통해요!',
      timeAgo: '1시간 5분 전',
      heart: 2900,
      comments: 13,
    },
    {
      id: 13,
      title: '운동 슬럼프 극복 방법?',
      content: '운동이 너무 하기 싫은데 어떻게 해야 할까요?',
      category: '궁금해요!',
      timeAgo: '1시간 10분 전',
      heart: 1900,
      comments: 4,
    },
    {
      id: 14,
      title: '오늘의 운동 기록',
      content: '벤치프레스 100kg 성공!',
      category: '운동해요!',
      timeAgo: '1시간 15분 전',
      heart: 5000,
      comments: 30,
    },
    {
      id: 15,
      title: '다이어트 중인데 너무 힘드네요',
      content: '다이어터분들 힘내세요!',
      category: '소통해요!',
      timeAgo: '1시간 20분 전',
      heart: 2700,
      comments: 8,
    },
  ];

  const filteredPosts =
    activeCategory === '전체' ? allGeneralPosts : allGeneralPosts.filter((post) => post.category === activeCategory);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <PageContainer>
        <MainContentArea>
          <SidebarWrapper>
            <CustomCategoryMenu
              categories={communityCategories}
              selectedCategory={activeCategory}
              onSelectCategory={(category) => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
            />
          </SidebarWrapper>

          <MainContentWrapper>
            <SectionHeader>
              <SectionTitle>커뮤니티</SectionTitle>
              <WriteButton to="/communityPostCreationPage">
                <FaPencilAlt />
                글쓰기
              </WriteButton>
            </SectionHeader>

            <NoticeSection>
              {notices.map((notice) => (
                <NoticeItem key={notice.id}>
                  <NoticeLabel>공지</NoticeLabel>
                  <NoticeText>{notice.title}</NoticeText>
                  <NoticeLink href={notice.link}>{notice.icon}</NoticeLink>
                </NoticeItem>
              ))}
            </NoticeSection>

            {activeCategory === '전체' && (
              <>
                <SectionTitleSmall>TOP 5 커뮤니티 글🔥</SectionTitleSmall>
                <TopPostsGrid>
                  {topPosts.map((post) => (
                    // TOP 5 게시물에 Link 추가
                    <StyledPostLink key={post.id} to={`/communityDetailPage/${post.id}`}>
                      <PostCard>
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
                    </StyledPostLink>
                  ))}
                </TopPostsGrid>

                <SectionTitleMini>고객님들의 최신 사진 게시글</SectionTitleMini>
                <PhotoPostsGrid>
                  {photoPosts.map((post) => (
                    // 사진 게시물에 Link 추가
                    <StyledPostLink key={post.id} to={`/communityDetailPage/${post.id}`}>
                      <PhotoPostCard>
                        <PhotoPostImage src={post.img} alt={post.title} />
                        <PhotoPostContent>
                          <PhotoPostTitle>{post.title}</PhotoPostTitle>
                          <PhotoPostText>{post.content}</PhotoPostText>
                          <PostMeta>
                            <span>
                              <FaThumbsUp /> {post.heart}
                            </span>
                            <span>
                              <RiMessage2Fill /> {post.comments}
                            </span>
                          </PostMeta>
                        </PhotoPostContent>
                      </PhotoPostCard>
                    </StyledPostLink>
                  ))}
                </PhotoPostsGrid>
              </>
            )}

            {/* 일반 게시글 목록은 GeneralPostsList 컴포넌트 내에서 Link 처리 */}
            <GeneralPostsList posts={currentPosts} />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </MainContentWrapper>
        </MainContentArea>
      </PageContainer>
    </>
  );
}

export default CommunityPage;

// --- CommunityPage에 남겨둘 스타일 컴포넌트 ---
// 기존 스타일 유지 (PostCard, PhotoPostCard 등)
// Link 컴포넌트에 스타일을 적용하기 위한 StyledPostLink 추가
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 106px;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
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
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
`;

const WriteButton = styled(Link)`
  display: flex;
  outline: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #163a82;
  }

  svg {
    font-size: 14px;
  }
`;

const NoticeSection = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
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
  background-color: ${({ theme }) => theme.colors.gray[400]};
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

// Link 컴포넌트에 스타일을 적용하기 위한 래퍼
const StyledPostLink = styled(Link)`
  text-decoration: none; // 기본 링크 밑줄 제거
  color: inherit; // 부모 요소의 글자 색상 상속
  cursor: pointer;

  &:hover {
    opacity: 0.9; // 호버 시 약간의 투명도 변화
    transform: translateY(-2px); // 약간 위로 올라가는 효과
    box-shadow: ${({ theme }) => theme.shadows.md}; // 그림자 효과
  }

  transition: all 0.2s ease-in-out; // 부드러운 전환 효과
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
  height: 100%; // Link로 감싸도 높이 유지
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
    gap: 3px;
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
  overflow: hidden;
  height: 100%; // Link로 감싸도 높이 유지
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
