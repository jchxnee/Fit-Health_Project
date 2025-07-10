// CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPencilAlt, FaThumbsUp, FaEye } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import GeneralPostsList from '../../components/GeneralPostsList';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // postsPerPage를 상수로 만듦

  const [generalPosts, setGeneralPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [photoPosts, setPhotoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

  // 백엔드에서 받은 전체 페이지 정보 (페이지네이션에 사용)
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const notices = [{ id: 1, title: '공지: 핏헬스 가이드라인', icon: '>', link: '#' }];
  const Categories = [{ name: '전체' }, { name: '운동해요!' }, { name: '궁금해요!' }, { name: '소통해요!' }];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(API_ENDPOINTS.BOARD.ALL, {
          params: {
            category: activeCategory, // 백엔드에서 "전체"를 처리하므로 그대로 전달
            page: currentPage - 1, // 스프링 Pageable은 0부터 시작
            size: postsPerPage,
            sort: 'createdDate,desc', // 최신순 정렬 (백엔드 엔티티 필드명 기준)
          },
        });

        const fetchedPageResponse = response.data; // PageResponse 객체 전체
        const allPostsContent = fetchedPageResponse.content; // 실제 게시글 배열

        // 전체 게시글 수와 전체 페이지 수를 백엔드 응답에서 설정
        setTotalPostsCount(fetchedPageResponse.totalCount);
        setTotalPages(fetchedPageResponse.totalPage);

        // 1. TOP 3 게시글: 조회수(count) 기준으로 내림차순 정렬 후 상위 3개
        const sortedByViews = [...allPostsContent].sort((a, b) => b.count - a.count);
        setTopPosts(sortedByViews.slice(0, 3));

        // 2. 사진 게시글: 파일이 첨부된 게시글 중 최신 4개
        const photoPostsData = [...allPostsContent]
          .filter((post) => post.files && post.files.length > 0)
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        setPhotoPosts(photoPostsData.slice(0, 4));

        // 3. 일반 게시글 (현재 페이지의 데이터만):
        // 백엔드에서 이미 현재 페이지에 맞는 데이터를 보내주므로 필터링 필요 없음
        setGeneralPosts(allPostsContent); // 현재 페이지의 게시글만 설정
      } catch (err) {
        console.error('게시글 데이터를 불러오는 중 오류 발생:', err);
        // network error가 아닌 경우 err.response.data 등을 통해 상세 에러 메시지를 얻을 수 있음
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, currentPage, postsPerPage]); // activeCategory, currentPage, postsPerPage 변경 시 다시 불러옴

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <PageContainer>
        <div>게시글을 불러오는 중입니다...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div>오류: {error}</div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <MainContentArea>
          <SidebarWrapper>
            <CustomCategoryMenu
              categories={Categories}
              selectedCategory={activeCategory}
              onSelectCategory={(category) => {
                setActiveCategory(category);
                setCurrentPage(1); // 카테고리 변경 시 1페이지로 초기화
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
                  <div>
                    <NoticeLabel>공지</NoticeLabel>
                    <NoticeText>{notice.title}</NoticeText>
                  </div>
                  <NoticeLink href={notice.link}>{notice.icon}</NoticeLink>
                </NoticeItem>
              ))}
            </NoticeSection>

            {activeCategory === '전체' && topPosts.length > 0 && (
              <>
                <SectionTitleSmall>TOP 3 커뮤니티 글🔥</SectionTitleSmall>
                <TopPostsGrid>
                  {topPosts.map((post) => (
                    <StyledPostLink key={post.board_no} to={`/communityDetailPage/${post.board_no}`}>
                      <PostCard>
                        <PostCardTitle>{post.board_title}</PostCardTitle>
                        <PostMeta>
                          <span>
                            <FaEye /> {post.count}
                          </span>
                          <span>
                            <RiMessage2Fill /> {post.comments_count || 0}
                          </span>
                        </PostMeta>
                      </PostCard>
                    </StyledPostLink>
                  ))}
                </TopPostsGrid>
              </>
            )}

            {activeCategory === '전체' && photoPosts.length > 0 && (
              <>
                <SectionTitleMini>고객님들의 최신 사진 게시글</SectionTitleMini>
                <PhotoPostsGrid>
                  {photoPosts.map((post) => (
                    <StyledPostLink key={post.board_no} to={`/communityDetailPage/${post.board_no}`}>
                      <PhotoPostCard>
                        <PhotoPostImage src={`${CLOUDFRONT_URL}${post.files[0].change_name}`} alt={post.board_title} />
                        <PhotoPostContent>
                          <PhotoPostTitle>{post.board_title}</PhotoPostTitle>
                          <PhotoPostText>{post.board_content}</PhotoPostText>
                          <PostMeta>
                            <span>
                              <FaThumbsUp /> {post.heart}
                            </span>
                            <span>
                              <RiMessage2Fill /> {post.comments_count || 0}
                            </span>
                          </PostMeta>
                        </PhotoPostContent>
                      </PhotoPostCard>
                    </StyledPostLink>
                  ))}
                </PhotoPostsGrid>
              </>
            )}

            {/* 일반 게시글 목록 */}
            {/* 백엔드에서 이미 페이지네이션된 데이터를 주므로 generalPosts를 바로 전달 */}
            <GeneralPostsList posts={generalPosts} />

            {/* totalPages를 백엔드에서 받아온 값으로 사용 */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </MainContentWrapper>
        </MainContentArea>
      </PageContainer>
    </>
  );
}

export default CommunityPage;

// --- CommunityPage에 남겨둘 스타일 컴포넌트 ---
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
  justify-content: space-between;
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

const StyledPostLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  transition: all 0.2s ease-in-out;
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
  height: 100%;
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
  height: 100%;
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
