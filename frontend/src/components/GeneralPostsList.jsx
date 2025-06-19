// src/components/GeneralPostsList.jsx
import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import 추가

const GeneralPostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

// Link 컴포넌트에 스타일을 적용하기 위한 래퍼
// 기존 GeneralPostItem의 스타일을 상속받고 Link의 기능 추가
const StyledLink = styled(Link)`
  text-decoration: none; // 기본 링크 밑줄 제거
  color: inherit; // 부모 요소의 글자 색상 상속
  cursor: pointer;
  display: flex; /* GeneralPostItem의 flex 속성을 유지 */
  flex-direction: column; /* GeneralPostItem의 flex-direction 유지 */
  gap: ${({ theme }) => theme.spacing[1]}; /* GeneralPostItem의 gap 유지 */

  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  transition:
    background-color 0.2s ease-in-out,
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    transform: translateY(-2px); /* 약간 위로 올라가는 효과 */
    box-shadow: ${({ theme }) => theme.shadows.sm}; /* 그림자 효과 추가 */
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
  // handlePostClick 함수는 Link 컴포넌트 사용으로 더 이상 필요 없습니다.
  // const handlePostClick = (postId) => {
  //   console.log(`게시글 클릭: ${postId}`);
  // };

  if (!posts || posts.length === 0) {
    return <NoPostsMessage>게시물이 없습니다.</NoPostsMessage>;
  }

  return (
    <GeneralPostsContainer>
      {posts.map((post) => (
        // Link 컴포넌트로 GeneralPostItem 내용을 감싸고, to 프롭에 경로 지정
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
            <TimeAgoReview>{post.timeAgo}</TimeAgoReview>
          </PostMeta>
        </StyledLink>
      ))}
    </GeneralPostsContainer>
  );
}

export default GeneralPostsList;
