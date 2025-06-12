import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHeart, FaRegHeart, FaEllipsisV, FaShareAlt } from 'react-icons/fa'; // 좋아요, 더보기, 공유 아이콘
import { RiMessage2Fill } from 'react-icons/ri'; // 댓글 아이콘
import { FaPaperPlane } from 'react-icons/fa'; // 댓글 전송 아이콘
import betaImg from '../assets/beta_user_img.png'; // 더미 사용자 이미지 (경로 수정 필요)

function CommunityPostDetailPage() {
  const [user] = useState({ name: '김현아', img: betaImg }); // 현재 로그인 사용자 정보 (더미)
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [likesCount, setLikesCount] = useState(120); // 좋아요 수
  const [commentInput, setCommentInput] = useState(''); // 댓글 입력창 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 더보기 메뉴 드롭다운 상태
  const menuRef = useRef(null); // 더보기 메뉴 외부 클릭 감지를 위한 ref

  // 더미 게시글 데이터 (실제 백엔드 데이터로 대체될 부분)
  const post = {
    id: 1,
    category: '운동해요!',
    title: '이거 어떻게 쓰는거에요?',
    author: '김현아',
    authorProfileImg: betaImg,
    authorRegion: '서울',
    authorRegionDetail: '강남구',
    timeAgo: '1시간 전',
    views: 12,
    content: `아니 바 사니까 이것도 같이 딸려오는데 이게 뭔가요 악력 키우기인가요? 혹시 사용법 아시는 분 알려주시면 감사하겠습니다.`,
    images: [betaImg, betaImg],
    comments: [
      {
        id: 1,
        author: '이우진',
        authorType: '핏코치',
        authorRegion: '서울',
        authorRegionDetail: '강남구',
        timeAgo: '5분 전',
        text: '데드리프트 할 때 등 고정하는 악력 키우는 데 도움이 됩니다.',
        profileImg: betaImg,
      },
      {
        id: 2,
        author: '최현우',
        authorType: '일반사용자',
        authorRegion: '서울',
        authorRegionDetail: '강남구',
        timeAgo: '4분 전',
        text: '와~ 저는 저거 뭔지도 몰랐네요! 신기하다 ㅎㅎㅎ',
        profileImg: betaImg,
      },
      {
        id: 3,
        author: '김현아',
        authorType: '일반사용자',
        authorRegion: '서울',
        authorRegionDetail: '강남구',
        timeAgo: '2분 전',
        text: '네 맞아요! 저도 잘 모르고 샀는데 쓸만하더라고요~',
        profileImg: betaImg,
      },
    ],
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === '') return;
    console.log('새 댓글:', commentInput);
    // 실제 백엔드에 댓글 전송 로직 추가 필요
    setCommentInput(''); // 입력창 초기화
  };

  // 더보기 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <MainContentWrapper>
          <PostHeader>
            <PostCategory>커뮤니티 &gt; {post.category}</PostCategory>
            <PostTitle>{post.title}</PostTitle>
            <PostAuthorRegion>
              {post.authorRegion} {post.authorRegionDetail}
            </PostAuthorRegion>{' '}
            <PostInfo>
              <AuthorInfo>
                <ProfileImage src={post.authorProfileImg || betaImg} alt={post.author} />
                <AuthorDetailsStyled>
                  <AuthorName>{post.author}</AuthorName>
                  <PostMeta>
                    <TimeAgo>{post.timeAgo}</TimeAgo>
                    <Separator>·</Separator>
                    <ViewsCount>조회 {post.views}</ViewsCount>
                  </PostMeta>
                </AuthorDetailsStyled>
              </AuthorInfo>
              <PostActions ref={menuRef}>
                <ShareButton>
                  <FaShareAlt color="#757575" />
                </ShareButton>
                <EllipsisButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <FaEllipsisV color="#757575" />
                </EllipsisButton>
                {isMenuOpen && (
                  <DropdownMenu>
                    <DropdownMenuItem>수정</DropdownMenuItem>
                    <DropdownMenuItem>삭제</DropdownMenuItem>
                  </DropdownMenu>
                )}
              </PostActions>
            </PostInfo>
          </PostHeader>

          <PostContent>
            <p>{post.content}</p>
            <ImageGallery>
              {post.images.map((imgSrc, index) => (
                <ImageItem key={index} src={imgSrc} alt={`게시글 이미지 ${index + 1}`} />
              ))}
            </ImageGallery>
            <InteractionStats>
              <LikeButton onClick={handleLikeToggle}>
                {isLiked ? <FaHeart color="#E53935" /> : <FaRegHeart color="#757575" />}
                <span>좋아요 {likesCount}</span>
              </LikeButton>
              <CommentCount>
                <RiMessage2Fill color="#757575" />
                <span>댓글 {post.comments.length}</span>
              </CommentCount>
            </InteractionStats>
          </PostContent>

          <CommentSection>
            <CommentInputContainer onSubmit={handleCommentSubmit}>
              <CommentInputField
                type="text"
                placeholder="댓글을 남겨보세요."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <SendButton type="submit">
                <FaPaperPlane />
              </SendButton>
            </CommentInputContainer>
            <CommentList>
              {post.comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentAuthorInfo>
                    <ProfileImage src={comment.profileImg || betaImg} alt={comment.author} />
                    <AuthorDetails>
                      <AuthorDetailsSmall>
                        <AuthorName>{comment.author}</AuthorName>
                        <AuthorType>{comment.authorType}</AuthorType>
                      </AuthorDetailsSmall>
                      <CommentAuthorRegion>
                        {comment.authorRegion} {comment.authorRegionDetail}
                      </CommentAuthorRegion>{' '}
                    </AuthorDetails>
                  </CommentAuthorInfo>
                  <CommentText>{comment.text}</CommentText>
                  <CommentTime>{comment.timeAgo}</CommentTime>
                </CommentItem>
              ))}
            </CommentList>
          </CommentSection>
        </MainContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}

export default CommunityPostDetailPage;

// --- 스타일 컴포넌트 ---

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const MainContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg}; /* 1008px */
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing['8']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  padding: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['6']};
`;

const PostHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  padding-bottom: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  text-align: start;
`;

const PostCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['600']};
  margin-bottom: ${({ theme }) => theme.spacing['1']};
  display: block;
`;

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['900']};
  margin: 0;
`;

const PostAuthorRegion = styled.span`
  display: block; /* 줄바꿈을 위해 block 요소로 */
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-top: ${({ theme }) => theme.spacing['2']}; /* 글 제목과의 간격 */
  margin-bottom: ${({ theme }) => theme.spacing['4']}; /* 아래 PostInfo와의 간격 */
`;

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: ${({ theme }) => theme.spacing['3']}; <- 위 PostAuthorRegion에 마진을 주면서 필요 없어짐 */
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']}; /* 프로필 사진과 이름/시간 간격 */
`;

const AuthorDetailsStyled = styled.div`
  /* 글쓴이 이름과 시간/조회수 묶음 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PostMeta = styled.div`
  /* 시간과 조회수 묶음 */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['500']};
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray['700']};
`;

const TimeAgo = styled.span`
  /* font-size: ${({ theme }) => theme.fontSizes.sm}; */
  /* color: ${({ theme }) => theme.colors.gray['500']}; */
`;

const ViewsCount = styled.span`
  /* font-size: ${({ theme }) => theme.fontSizes.sm}; */
  /* color: ${({ theme }) => theme.colors.gray['500']}; */
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.gray['400']};
  margin: 0 2px;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  position: relative; /* 드롭다운 메뉴를 위한 상대 위치 */
`;

const ShareButton = styled.button`
  /* 공유 버튼 스타일 */
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:hover {
    opacity: 0.8;
  }
`;

const EllipsisButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  min-width: 100px;
  overflow: hidden; /* 자식 요소의 border-radius를 위해 */
`;

const DropdownMenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['800']};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const PostContent = styled.div`
  text-align: start;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray['800']};
  font-size: ${({ theme }) => theme.fontSizes.base};

  p {
    margin-bottom: ${({ theme }) => theme.spacing['6']};
  }
`;

const ImageGallery = styled.div`
  display: flex;
  overflow-x: auto; /* 이미지가 많을 경우 가로 스크롤 */
  gap: ${({ theme }) => theme.spacing['3']};
  padding-bottom: ${({ theme }) => theme.spacing['2']}; /* 스크롤바 공간 확보 */
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const ImageItem = styled.img`
  width: 200px; /* 이미지 너비 고정 */
  height: 200px; /* 이미지 높이 고정 */
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  flex-shrink: 0; /* 이미지들이 축소되지 않도록 */
`;

const InteractionStats = styled.div`
  /* 좋아요, 댓글 수를 포함하는 새로운 컨테이너 */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-top: ${({ theme }) => theme.spacing['4']};
  padding-top: ${({ theme }) => theme.spacing['4']};
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const CommentSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  padding-top: ${({ theme }) => theme.spacing['6']};
`;

const CommentInputContainer = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  background-color: ${({ theme }) => theme.colors.gray['100']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
`;

const CommentInputField = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['500']};
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['5']};
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing['1']};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['100']};
  padding-bottom: ${({ theme }) => theme.spacing['3']};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const CommentAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${({ theme }) => theme.spacing['1']};
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  object-fit: cover;
  flex-shrink: 0;
`;

const AuthorDetails = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column; /* 이름과 유형을 한 줄로 */
  gap: ${({ theme }) => theme.spacing['2']};
`;

const AuthorDetailsSmall = styled.div`
  display: flex;
  flex-direction: row; /* 이름과 유형을 한 줄로 */
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const CommentText = styled.p`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin: 0;
  line-height: 1.4;
`;

const CommentTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-top: ${({ theme }) => theme.spacing['1']};
  align-self: flex-start;
`;

const AuthorType = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary}; /* 핏코치/일반사용자 구분 색상 */
  background-color: ${({ theme }) => theme.colors.primaryLight}; /* 배경색 */
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const CommentAuthorRegion = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray['500']};
`;
