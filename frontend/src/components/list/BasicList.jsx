import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaCommentDots } from 'react-icons/fa';

const PostListContainer = styled.div`
  width: ${({ theme }) => theme.width.lg};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
`;

const PostItemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => theme.spacing[5]} 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

const PostContent = styled.div`
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PostText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const EngagementInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Icon = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const PostDate = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export default function BasicList({ posts }) {
  return (
    <PostListContainer>
      {posts.map((post) => (
        <PostItemWrapper key={post.id}>
          <PostContent>
            <PostTitle>{post.title}</PostTitle>
            <PostText>{post.content}</PostText>
          </PostContent>
          <PostMeta>
            <EngagementInfo>
              <MetaItem>
                <Icon>
                  <FaThumbsUp />
                </Icon>
                좋아요 {post.likes}
              </MetaItem>
              <MetaItem>
                <Icon>
                  <FaCommentDots />
                </Icon>
                댓글 {post.comments}
              </MetaItem>
            </EngagementInfo>
            <PostDate>{post.date}</PostDate>
          </PostMeta>
        </PostItemWrapper>
      ))}
    </PostListContainer>
  );
}
