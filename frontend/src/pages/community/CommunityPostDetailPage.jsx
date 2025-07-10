import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaThumbsUp, FaEllipsisV, FaShareAlt, FaTimes } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import { FaPaperPlane } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // api 인스턴스 import 확인
import { API_ENDPOINTS } from '../../api/config';
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';

// Global 스타일을 정의하여 모달 배경을 어둡게 처리하고 스크롤을 막습니다.
const GlobalModalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.modalOpen ? 'hidden' : 'auto')};
  }
`;

function CommunityPostDetailPage() {
  // CloudFront URL, 실제 사용하는 URL로 변경해주세요.
  const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

  const { user } = useUserStore(); // 사용자 정보 스토어
  const { id } = useParams(); // URL 파라미터에서 게시글 번호(id) 가져오기
  const boardNo = id;
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 게시글 관련 상태
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 좋아요 관련 상태
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 댓글 입력 관련 상태
  const [commentInput, setCommentInput] = useState('');

  // 게시글 메뉴(수정/삭제) 관련 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // 더보기 메뉴 외부 클릭 감지를 위한 Ref

  // 이미지 확대 보기 관련 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const currentUserEmail = user.email; // 현재 로그인한 사용자의 이메일 (좋아요, 댓글, 게시글 권한 확인용)

  // 이미지 확대 모달 열기 핸들러
  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  // 이미지 확대 모달 닫기 핸들러
  const closeImageModal = () => {
    setSelectedImageUrl(null);
    setIsImageModalOpen(false);
  };

  // 게시글 데이터 및 댓글 목록 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화

        // 게시글 상세 정보와 좋아요 상태를 포함하여 가져옵니다.
        const response = await api.get(`${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`);
        const fetchedPost = response.data;

        setPost(fetchedPost);
        setLikesCount(fetchedPost.heart || 0); // 좋아요 수 설정
        setIsLiked(fetchedPost.is_liked_by_user); // 현재 사용자의 좋아요 여부 설정

        // 게시글 조회수 증가 API 호출 (비동기)
        await api.put(`/api/board/${boardNo}/view`);
      } catch (err) {
        console.error('게시글 상세 정보를 불러오는 중 오류 발생:', err);
        setError('게시글 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    // boardNo와 currentUserEmail이 유효할 때만 데이터를 불러옵니다.
    if (boardNo && currentUserEmail) {
      fetchPostDetail();
    }
  }, [boardNo, currentUserEmail]); // boardNo 또는 currentUserEmail이 변경될 때마다 실행

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    try {
      // 좋아요/좋아요 취소 API 호출 (POST 요청에 userEmail을 body로 보냅니다)
      const response = await api.post(`${API_ENDPOINTS.BOARD.LIKE}/${boardNo}/like`, currentUserEmail, {
        headers: {
          'Content-Type': 'application/json', // 백엔드가 JSON을 기대하므로 명시
        },
      });
      const newLikedStatus = response.data; // 백엔드에서 좋아요 상태(true/false)를 반환한다고 가정

      setIsLiked(newLikedStatus); // 좋아요 상태 업데이트
      setLikesCount((prevCount) => (newLikedStatus ? prevCount + 1 : prevCount - 1)); // 좋아요 수 업데이트
      toast.success(newLikedStatus ? '게시글에 좋아요를 눌렀습니다!' : '게시글 좋아요를 취소했습니다.');
    } catch (err) {
      console.error('좋아요 토글 중 오류 발생:', err);
      // 에러 메시지가 있다면 토스트 메시지로 표시
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`좋아요 처리에 실패했습니다: ${err.response.data.message}`);
      } else {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    }
  };

  // 댓글 제출 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    if (commentInput.trim() === '') return; // 입력값이 비어있으면 리턴

    try {
      const newCommentData = {
        board_no: boardNo,
        comment_content: commentInput,
        user_email: currentUserEmail,
      };
      // 댓글 생성 API 호출
      await api.post(API_ENDPOINTS.COMMENT.CREATE, newCommentData);

      // 댓글 등록 후 최신 댓글 목록을 반영하기 위해 게시글 정보 다시 불러오기
      const updatedPostResponse = await api.get(
        `${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`
      );
      setPost(updatedPostResponse.data); // 게시글 상태 업데이트
      setCommentInput(''); // 댓글 입력 필드 초기화
      toast.success('댓글이 성공적으로 등록되었습니다.');
    } catch (err) {
      console.error('댓글 작성 중 오류 발생:', err);
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentNo) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return; // 사용자가 취소하면 삭제 중단
    }
    try {
      // 댓글 삭제 API 호출 (DELETE 요청에 user_email을 body로 보냄)
      // 백엔드에서 DELETE 요청의 body를 제대로 파싱하도록 설정되어 있어야 합니다.
      await api.delete(`${API_ENDPOINTS.COMMENT.DELETE}/${commentNo}`, {
        data: { user_email: currentUserEmail },
      });
      toast.success('댓글이 삭제되었습니다.');
      // 댓글 삭제 후 게시글 정보를 다시 불러와 댓글 목록 업데이트
      const updatedPostResponse = await api.get(
        `${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`
      );
      setPost(updatedPostResponse.data);
    } catch (err) {
      console.error('댓글 삭제 중 오류 발생:', err);
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return; // 사용자가 취소하면 삭제 중단
    }
    try {
      // 게시글 삭제 API 호출 (PUT 요청에 user_email을 body로 보냄, 백엔드 로직에 따라 PUT 사용)
      await api.put(`${API_ENDPOINTS.BOARD.DELETE}/${boardNo}`, { user_email: currentUserEmail });
      toast.success('게시글이 삭제되었습니다.');
      navigate('/community'); // 삭제 후 커뮤니티 목록 페이지로 이동
    } catch (err) {
      console.error('게시글 삭제 중 오류 발생:', err);
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  // 더보기 메뉴 외부 클릭 감지 (메뉴 자동 닫힘 기능)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 메뉴Ref가 존재하고, 클릭된 요소가 메뉴Ref 내부에 포함되어 있지 않으면 메뉴 닫기
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    // 문서에 마우스다운 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 로딩 중일 때 표시
  if (loading) {
    return <PageContainer>로딩 중...</PageContainer>;
  }

  // 에러 발생 시 표시
  if (error) {
    return <PageContainer>오류: {error}</PageContainer>;
  }

  // 게시글이 없을 경우 (예: 404 Not Found)
  if (!post) {
    return <PageContainer>게시글을 찾을 수 없습니다.</PageContainer>;
  }

  return (
    <>
      {/* 이미지 모달이 열려 있을 때 body 스크롤을 막는 Global 스타일 적용 */}
      <GlobalModalStyle modalOpen={isImageModalOpen} />

      <PageContainer>
        <MainContentWrapper>
          <PostHeader>
            <PostCategory>커뮤니티 &gt; {post.board_category_name}</PostCategory>
            <PostTitle>{post.board_title}</PostTitle>
            <PostAuthorRegion>{post.address}</PostAuthorRegion>
            <PostInfo>
              <AuthorInfo>
                {/* 게시글 작성자 프로필 이미지 */}
                <ProfileImage src={`${CLOUDFRONT_URL}${post.profile_image}`} alt={post.user_name} />
                <AuthorDetailsStyled>
                  <AuthorName>{post.user_name}</AuthorName>
                  <PostMeta>
                    <TimeAgo>{new Date(post.created_date).toLocaleString()}</TimeAgo>
                    <Separator>·</Separator>
                    <ViewsCount>조회 {post.count}</ViewsCount>
                  </PostMeta>
                </AuthorDetailsStyled>
              </AuthorInfo>
              <PostActions ref={menuRef}>
                <ShareButton>
                  <FaShareAlt color="#757575" />
                </ShareButton>
                {/* 현재 로그인한 사용자가 게시글 작성자인 경우에만 수정/삭제 메뉴 표시 */}
                {currentUserEmail === post.user_email && (
                  <>
                    <EllipsisButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      <FaEllipsisV color="#757575" />
                    </EllipsisButton>
                    {isMenuOpen && (
                      <DropdownMenu>
                        <DropdownMenuItem onClick={() => navigate(`/community/${boardNo}/edit`)}>수정</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeletePost}>삭제</DropdownMenuItem>
                      </DropdownMenu>
                    )}
                  </>
                )}
              </PostActions>
            </PostInfo>
          </PostHeader>

          <PostContent>
            <p>{post.board_content}</p>
            <ImageGallery>
              {post.files &&
                post.files.map((file, index) => (
                  <ImageItem
                    key={file.file_no}
                    src={`${CLOUDFRONT_URL}${file.change_name}`}
                    alt={`게시글 이미지 ${index + 1}`}
                    onClick={() => openImageModal(`${CLOUDFRONT_URL}${file.change_name}`)} // 이미지 클릭 시 모달 열기
                  />
                ))}
            </ImageGallery>
            <InteractionStats>
              <LikeButton onClick={handleLikeToggle}>
                {isLiked ? <FaThumbsUp color="#E53935" /> : <FaThumbsUp color="#757575" />}
                <span>좋아요 {likesCount}</span>
              </LikeButton>
              <CommentCount>
                <RiMessage2Fill color="#757575" />
                <span>댓글 {post.comments_count || 0}</span>
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
              {post.comments &&
                post.comments.map((comment) => (
                  <CommentItem key={comment.comment_no}>
                    <CommentHeader>
                      <CommentAuthorInfo>
                        {/* 댓글 작성자 프로필 이미지 */}
                        <ProfileImage src={`${CLOUDFRONT_URL}${comment.profile_image}`} alt={comment.user_name} />
                        <AuthorDetails>
                          <AuthorDetailsSmall>
                            <AuthorName>{comment.user_name}</AuthorName>
                          </AuthorDetailsSmall>
                          <CommentAuthorRegion></CommentAuthorRegion>
                        </AuthorDetails>
                      </CommentAuthorInfo>
                      {/* 현재 로그인한 사용자가 댓글 작성자인 경우에만 삭제 버튼 표시 */}
                      {currentUserEmail === comment.user_email && (
                        <DeleteCommentButton onClick={() => handleDeleteComment(comment.comment_no)}>
                          <FaTimes size="14" color="#a0a0a0" />
                        </DeleteCommentButton>
                      )}
                    </CommentHeader>
                    <CommentText>{comment.comment_content}</CommentText>
                    <CommentTime>{new Date(comment.created_date).toLocaleString()}</CommentTime>
                  </CommentItem>
                ))}
            </CommentList>
          </CommentSection>
        </MainContentWrapper>
      </PageContainer>

      {/* 이미지 확대 보기 모달 (isImageModalOpen 상태에 따라 조건부 렌더링) */}
      {isImageModalOpen && (
        <ImageModalOverlay onClick={closeImageModal}>
          {' '}
          {/* 오버레이 클릭 시 모달 닫기 */}
          <ImageModal onClick={(e) => e.stopPropagation()}>
            {' '}
            {/* 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 방지 */}
            <CloseButton onClick={closeImageModal}>
              {' '}
              {/* 닫기 버튼 */}
              <FaTimes size={20} color="white" />
            </CloseButton>
            <ModalImage src={selectedImageUrl} alt="확대된 이미지" />
          </ImageModal>
        </ImageModalOverlay>
      )}
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
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing['8']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  padding: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['8']};
`;

const PostHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  padding-bottom: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  text-align: start;
`;

const PostCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['400']};
  margin-bottom: ${({ theme }) => theme.spacing['5']};
  display: block;
`;

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['900']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const PostAuthorRegion = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['400']};
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
`;

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const AuthorDetailsStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PostMeta = styled.div`
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

const TimeAgo = styled.span``;

const ViewsCount = styled.span``;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.gray['400']};
  margin: 0 2px;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  position: relative;
`;

const ShareButton = styled.button`
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
  overflow: hidden;
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
  overflow-x: auto;
  gap: ${({ theme }) => theme.spacing['3']};
  padding-bottom: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const ImageItem = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover; /* 이미지가 잘리더라도 영역에 꽉 채움 */
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  flex-shrink: 0; /* flex 컨테이너 내에서 축소되지 않도록 함 */
  cursor: pointer; /* 클릭 가능한 요소임을 나타냄 */
  transition: transform 0.2s ease-in-out; /* 확대/축소 시 부드러운 전환 효과 */

  &:hover {
    transform: scale(1.02); /* 마우스 오버 시 살짝 확대 */
  }
`;

const InteractionStats = styled.div`
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

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
`;

const CommentAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
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
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const AuthorDetailsSmall = styled.div`
  display: flex;
  flex-direction: row;
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

const CommentAuthorRegion = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray['500']};
`;

const DeleteCommentButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto; /* 오른쪽으로 이동 */
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray['500']};

  &:hover {
    color: ${({ theme }) => theme.colors.gray['700']};
  }
`;

// --- 이미지 확대 모달 관련 스타일 ---
const ImageModalOverlay = styled.div`
  position: fixed; /* 뷰포트에 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소들 위에 표시 */
  backdrop-filter: blur(5px); /* 배경 블러 효과 (선택 사항) */
`;

const ImageModal = styled.div`
  position: relative;
  background-color: black;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  max-width: 90%;
  max-height: 85%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 1001; /* 모달 이미지 위에 표시 */
  padding: 5px; /* 클릭 영역 확보 */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;
