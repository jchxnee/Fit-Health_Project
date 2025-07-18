import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPencilAlt, FaThumbsUp, FaEye } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import GeneralPostsList from '../../components/GeneralPostsList';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const [generalPosts, setGeneralPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [photoPosts, setPhotoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- 공지사항 관련 상태 및 로직 ---
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const navigate = useNavigate();

  // 공지사항 데이터 불러오기: 컴포넌트 마운트 시 한 번 호출
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.NOTICE.LIST, {
          params: {
            page: 0, // 첫 페이지 (0-based)
            size: 3, // 최신 공지사항 3개만 가져옴
            sort: 'createdDate,desc', // 최신순 정렬
          },
        });
        // API 응답의 content 필드에서 공지사항 목록을 가져와 상태에 저장
        setNotices(response.data.content || []);
      } catch (err) {
        console.error('공지사항 데이터를 불러오는 데 실패했습니다:', err);
      }
    };
    fetchNotices();
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 함

  // 공지사항 로테이션: notices 배열이 업데이트되거나 컴포넌트 마운트 시 인터벌 설정
  useEffect(() => {
    if (notices.length > 1) {
      // 공지사항이 2개 이상일 때만 로테이션
      const interval = setInterval(() => {
        // 현재 인덱스를 1 증가시키고 notices 배열의 길이로 나눈 나머지 값을 새로운 인덱스로 설정
        // 이렇게 하면 인덱스가 배열 길이를 초과하지 않고 처음으로 돌아감
        setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length);
      }, 5000); // 5초마다 변경

      // 컴포넌트 언마운트 시 또는 notices 배열이 변경되어 useEffect가 다시 실행될 때 기존 인터벌 정리
      return () => clearInterval(interval);
    }
  }, [notices]); // notices 배열이 변경될 때마다 이 이펙트가 다시 실행됨

  // 공지사항 클릭 시 해당 공지사항의 상세 페이지로 이동
  const handleNoticeClick = (noticeNo) => {
    navigate(`/NoticeDetailPage/${noticeNo}`);
  };
  // --- 공지사항 관련 상태 및 로직 끝 ---

  // 게시글 데이터 불러오기 (기존 코드와 동일)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(API_ENDPOINTS.BOARD.ALL, {
          params: {
            category: activeCategory,
            page: currentPage - 1,
            size: postsPerPage,
            sort: 'createdDate,desc',
          },
        });

        const fetchedPageResponse = response.data;
        const allPostsContent = fetchedPageResponse.content;

        setTotalPostsCount(fetchedPageResponse.totalCount);
        setTotalPages(fetchedPageResponse.totalPage);

        const sortedByViews = [...allPostsContent].sort((a, b) => b.count - a.count);
        setTopPosts(sortedByViews.slice(0, 3));

        const photoPostsData = [...allPostsContent]
          .filter((post) => post.files && post.files.length > 0)
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        setPhotoPosts(photoPostsData.slice(0, 4));

        setGeneralPosts(allPostsContent);
      } catch (err) {
        console.error('게시글 데이터를 불러오는 중 오류 발생:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, currentPage, postsPerPage]);

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
              categories={[{ name: '전체' }, { name: '운동해요!' }, { name: '궁금해요!' }, { name: '소통해요!' }]}
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

            {notices.length > 0 ? (
              <NoticeSection>
                <NoticeItem>
                  <div>
                    <NoticeLabel>공지</NoticeLabel>
                    {/* 현재 인덱스에 해당하는 공지사항 제목 표시 및 클릭 시 상세 페이지 이동 */}
                    <NoticeText onClick={() => handleNoticeClick(notices[currentNoticeIndex].notice_no)}>
                      {notices[currentNoticeIndex].notice_title}
                    </NoticeText>
                  </div>
                  {/* 상세 페이지로 이동하는 링크 아이콘 */}
                  <NoticeLink onClick={() => handleNoticeClick(notices[currentNoticeIndex].notice_no)}>&gt;</NoticeLink>
                </NoticeItem>
              </NoticeSection>
            ) : (
              <></>
            )}

            {/* 나머지 커뮤니티 섹션 (기존 코드와 동일) */}
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
                        {post.files && post.files.length > 0 && (
                          <PhotoPostImage
                            src={`${CLOUDFRONT_URL}${post.files[0].change_name}`}
                            alt={post.board_title}
                          />
                        )}
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

            <GeneralPostsList posts={generalPosts} />

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
  margin-right: ${({ theme }) => theme.spacing[5]};
`;

const NoticeText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const NoticeLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[800]};
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
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
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
