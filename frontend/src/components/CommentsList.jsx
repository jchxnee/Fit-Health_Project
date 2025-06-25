// src/components/CommentsList.jsx
import React from 'react';
import styled from 'styled-components';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CommentItem = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: pointer; /* 전체 아이템 클릭 가능하게 */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;
const CommentHeaderMini = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const GeneralPostCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: start;
`;

const PostTitleText = styled.span`
  // Link 대신 Text로 변경, 클릭 이벤트는 부모에 위임
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
  text-decoration: none;
  cursor: pointer; /* 명시적으로 커서 변경 */

  &:hover {
    text-decoration: underline;
  }
`;

const CommentContent = styled.p`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0;
  line-height: 1.5;
`;

const CommentTime = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  span {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const NoCommentsMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: ${({ theme }) => theme.spacing[5]};
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

// LocalDateTime을 'YYYY.MM.DD' 형식으로 변환하는 헬퍼 함수
const formatDate = (datetimeString) => {
  if (!datetimeString) return '';
  const date = new Date(datetimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

function CommentsList({ comments }) {
  const navigate = useNavigate();

  // 댓글 항목 클릭 시 해당 게시글 상세 페이지로 이동
  const handleCommentClick = (boardNo, commentNo) => {
    // 'communityDetailPage'는 예시 경로입니다. 실제 라우트 경로에 맞게 조정해주세요.
    navigate(`/communityDetailPage/${boardNo}#comment-${commentNo}`);
  };

  if (!comments || comments.length === 0) {
    return <NoCommentsMessage>작성된 댓글이 없습니다.</NoCommentsMessage>;
  }

  return (
    <CommentsContainer>
      {comments.map((comment) => (
        // CommentItem 전체를 클릭 가능하도록
        <CommentItem key={comment.comment_no} onClick={() => handleCommentClick(comment.board_no, comment.comment_no)}>
          <CommentHeader>
            <CommentHeaderMini>
              {/* MyCommentGetDto에 board_category_name 필드가 추가되었다고 가정 */}
              <GeneralPostCategory>{comment.board_category_name || '카테고리 정보 없음'}</GeneralPostCategory>
              {/* PostTitleLink에서 href는 제거하고, 텍스트만 표시하도록 PostTitleText로 변경 */}
              {/* 클릭 이벤트는 부모 CommentItem에서 처리하므로 여기서는 단순 텍스트로 */}
              <PostTitleText>{comment.board_title || '게시글 제목 정보 없음'}</PostTitleText>
            </CommentHeaderMini>
            <CommentTime>
              <span>{formatDate(comment.created_date)}</span>
            </CommentTime>
          </CommentHeader>
          <CommentContent>
            <IoArrowRedoSharp /> {comment.comment_content}
          </CommentContent>
        </CommentItem>
      ))}
    </CommentsContainer>
  );
}

export default CommentsList;
