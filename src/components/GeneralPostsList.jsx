// src/components/GeneralPostsList.jsx
import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';

const GeneralPostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const GeneralPostItem = styled.div`
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

const GeneralPostCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: start;
`;

const GeneralPostTitle = styled.h3`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const GeneralPostContent = styled.p`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[2]};

  span {
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

const PostHeartComment = styled.div`
  display: flex;
  justify-content: start;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[2]};

  span {
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

const TimeAgoReview = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const NoPostsMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: ${({ theme }) => theme.spacing[5]};
  /* min-height를 설정하여 내용이 없어도 컨테이너가 너무 줄어들지 않게 함 */
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* 부모 컨테이너가 flex일 때 공간을 채우도록 */
`;

function GeneralPostsList({ posts }) {
  const handlePostClick = (postId) => {
    console.log(`게시글 클릭: ${postId}`);
  };

  if (!posts || posts.length === 0) {
    return <NoPostsMessage>게시물이 없습니다.</NoPostsMessage>;
  }

  return (
    <GeneralPostsContainer>
      {posts.map((post) => (
        <GeneralPostItem key={post.id} onClick={() => handlePostClick(post.id)}>
          <GeneralPostCategory>{post.category}</GeneralPostCategory>
          <GeneralPostTitle>{post.title}</GeneralPostTitle>
          <GeneralPostContent>{post.content}</GeneralPostContent>
          <PostMeta>
            <PostHeartComment>
              <span>
                <FaThumbsUp /> {post.heart}
              </span>
              <span>
                <RiMessage2Fill /> {post.comments}
              </span>
            </PostHeartComment>
            <TimeAgoReview>{post.timeAgo}</TimeAgoReview>
          </PostMeta>
        </GeneralPostItem>
      ))}
    </GeneralPostsContainer>
  );
}

export default GeneralPostsList;
