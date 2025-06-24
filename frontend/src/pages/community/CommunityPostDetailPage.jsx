import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaEllipsisV, FaShareAlt, FaTimes } from 'react-icons/fa'; // FaTimes 아이콘 추가
import { RiMessage2Fill } from 'react-icons/ri';
import { FaPaperPlane } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';
import useUserStore from '../../store/useUserStore';

function CommunityPostDetailPage() {
  const { user } = useUserStore();
  const { id } = useParams();
  const boardNo = id;
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentUserEmail = user.email;

  // 게시글 데이터 및 댓글 목록 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`);
        const fetchedPost = response.data;

        setPost(fetchedPost);
        setLikesCount(fetchedPost.heart || 0);
        setIsLiked(fetchedPost.is_liked_by_user);

        await api.put(`/api/board/${boardNo}/view`);
      } catch (err) {
        console.error('게시글 상세 정보를 불러오는 중 오류 발생:', err);
        setError('게시글 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (boardNo) {
      fetchPostDetail();
    }
  }, [boardNo, currentUserEmail]);

  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(`http://localhost:7961/api/board/${boardNo}/like`, currentUserEmail, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newLikedStatus = response.data;

      setIsLiked(newLikedStatus);
      setLikesCount((prevCount) => (newLikedStatus ? prevCount + 1 : prevCount - 1));
    } catch (err) {
      console.error('좋아요 토글 중 오류 발생:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentInput.trim() === '') return;

    try {
      const newCommentData = {
        board_no: boardNo,
        comment_content: commentInput,
        user_email: currentUserEmail,
      };
      const response = await api.post(API_ENDPOINTS.COMMENT.CREATE, newCommentData);

      console.log('댓글 등록 성공:', response.data);

      const updatedPostResponse = await api.get(
        `${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`
      );
      setPost(updatedPostResponse.data);
      setCommentInput('');
    } catch (err) {
      console.error('댓글 작성 중 오류 발생:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제 핸들러 추가
  const handleDeleteComment = async (commentNo) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }
    try {
      await api.delete(`${API_ENDPOINTS.COMMENT.DELETE}/${commentNo}`);
      alert('댓글이 삭제되었습니다.');
      // 댓글 삭제 후 게시글 정보를 다시 불러와 댓글 목록 업데이트
      const updatedPostResponse = await api.get(
        `${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${currentUserEmail}`
      );
      setPost(updatedPostResponse.data);
    } catch (err) {
      console.error('댓글 삭제 중 오류 발생:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }
    try {
      await api.put(`${API_ENDPOINTS.BOARD.DELETE}/${boardNo}`);
      alert('게시글이 삭제되었습니다.');
      navigate('/community'); // 삭제 후 목록 페이지로 이동
    } catch (err) {
      console.error('게시글 삭제 중 오류 발생:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
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

  if (loading) {
    return <PageContainer>로딩 중...</PageContainer>;
  }

  if (error) {
    return <PageContainer>오류: {error}</PageContainer>;
  }

  if (!post) {
    return <PageContainer>게시글을 찾을 수 없습니다.</PageContainer>;
  }

  return (
    <>
      <PageContainer>
        <MainContentWrapper>
          <PostHeader>
            <PostCategory>커뮤니티 &gt; {post.board_category_name}</PostCategory>
            <PostTitle>{post.board_title}</PostTitle>
            <PostAuthorRegion>{post.address}</PostAuthorRegion>
            <PostInfo>
              <AuthorInfo>
                <ProfileImage src={post.profile_image} alt={post.user_name} />
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
                    src={`http://localhost:7961/uploads/${file.change_name}`}
                    alt={`게시글 이미지 ${index + 1}`}
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
                      {' '}
                      {/* CommentHeader 추가 */}
                      <CommentAuthorInfo>
                        <ProfileImage src={comment.profile_image} alt={comment.user_name} />
                        <AuthorDetails>
                          <AuthorDetailsSmall>
                            <AuthorName>{comment.user_name}</AuthorName>
                          </AuthorDetailsSmall>
                          <CommentAuthorRegion></CommentAuthorRegion>
                        </AuthorDetails>
                      </CommentAuthorInfo>
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
    </>
  );
}

export default CommunityPostDetailPage;

// --- 스타일 컴포넌트 (변경 있음) ---
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
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageItem = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  flex-shrink: 0;
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

// 댓글 헤더 (작성자 정보와 삭제 버튼을 함께 묶기 위해 추가)
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
