// src/components/MyCommentsList.jsx
import React from 'react';
import styled from 'styled-components';
import { IoArrowRedoSharp } from 'react-icons/io5';

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
  cursor: pointer;
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

const PostTitleLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
  text-decoration: none;
  cursor: pointer;

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

const CommentCategoryTime = styled.div`
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

function CommentsList({ comments }) {
  const handleCommentClick = (commentId, postId) => {
    console.log(`댓글 클릭: ${commentId}, 게시글 ID: ${postId}`);
    // 실제 애플리케이션에서는 해당 댓글이 달린 게시글 상세 페이지로 이동합니다.
    // 예: navigate(`/community/post/${postId}#comment-${commentId}`);
  };

  if (!comments || comments.length === 0) {
    return <NoCommentsMessage>작성된 댓글이 없습니다.</NoCommentsMessage>;
  }

  return (
    <CommentsContainer>
      {comments.map((comment) => (
        <CommentItem key={comment.id} onClick={() => handleCommentClick(comment.id, comment.postId)}>
          <CommentHeader>
            <CommentHeaderMini>
              <GeneralPostCategory>{comment.category}</GeneralPostCategory>
              <PostTitleLink href={`/community/post/${comment.postId}`}> {comment.postTitle}</PostTitleLink>
            </CommentHeaderMini>
            <CommentCategoryTime>
              <span>{comment.timeAgo}</span>
            </CommentCategoryTime>
          </CommentHeader>
          <CommentContent>
            <IoArrowRedoSharp /> {comment.content}
          </CommentContent>
        </CommentItem>
      ))}
    </CommentsContainer>
  );
}

export default CommentsList;
