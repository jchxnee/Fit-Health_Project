// src/components/GeneralPostsList.jsx
import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/timeAgo'; // ⭐ 새로 생성한 유틸리티 함수 임포트 ⭐

const GeneralPostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  transition:
    background-color 0.2s ease-in-out,
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
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
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

function GeneralPostsList({ posts }) {
  if (!posts || posts.length === 0) {
    return <NoPostsMessage>게시물이 없습니다.</NoPostsMessage>;
  }

  return (
    <GeneralPostsContainer>
      {posts.map((post) => (
        <StyledLink to={`/communityDetailPage/${post.board_no}`} key={post.board_no}>
          <GeneralPostCategory>{post.board_category_name}</GeneralPostCategory>
          <GeneralPostTitle>{post.board_title}</GeneralPostTitle>
          <GeneralPostContent>{post.board_content}</GeneralPostContent>
          <PostMeta>
            <PostHeartComment>
              <span>
                <FaThumbsUp /> {post.heart}
              </span>
              <span>
                <RiMessage2Fill /> {post.comments_count}
              </span>
            </PostHeartComment>
            {/* ⭐ created_date를 formatTimeAgo 함수에 전달하여 변환된 시간 표시 ⭐ */}
            <TimeAgoReview>{formatTimeAgo(post.created_date)}</TimeAgoReview>
          </PostMeta>
        </StyledLink>
      ))}
    </GeneralPostsContainer>
  );
}

export default GeneralPostsList;
