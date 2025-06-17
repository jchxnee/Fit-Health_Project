import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from 'react-icons/fi';
import { FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[24]} 0 ${theme.spacing[24]} 0`};
`;
const Container = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;
const Title = styled.h2`
  text-align: left;
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;
const ListRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
`;
const PostCol = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const PostBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => `${theme.spacing[4]} 0 ${theme.spacing[2]} 0`};
`;
const PostTitle = styled.div`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: left;
`;
const PostContent = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: pre-line;
  text-align: left;
`;
const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MoreInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
`;
const MoreText = styled.div`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`;
const ViewAllBtn = styled(Link)`
  background: none;
  border: none;
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 0;
`;

const posts = [
  {
    title: '제목입니다',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    views: 3700,
    comments: 10,
  },
  {
    title: '제목입니다',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    views: 3700,
    comments: 10,
  },
  {
    title: '제목입니다',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    views: 3700,
    comments: 10,
  },
  {
    title: '제목입니다',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    views: 3700,
    comments: 10,
  },
];

const PopularPosts = () => (
  <Wrapper>
    <Container>
      <Title>커뮤니티 인기 글</Title>
      <ListRow>
        <PostCol>
          {posts.slice(0, 3).map((p, i) => (
            <PostBox key={i}>
              <PostTitle>{p.title}</PostTitle>
              <PostContent>{p.content}</PostContent>
              <StatsRow>
                <FaRegEye></FaRegEye>
                {p.views}
                <FiMessageCircle></FiMessageCircle>
                {p.comments}
              </StatsRow>
            </PostBox>
          ))}
        </PostCol>
        <PostCol>
          {posts.slice(2, 5).map((p, i) => (
            <PostBox key={i}>
              <PostTitle>{p.title}</PostTitle>
              <PostContent>{p.content}</PostContent>
              <StatsRow>
                <FaRegEye></FaRegEye>
                {p.views}
                <FiMessageCircle></FiMessageCircle>
                {p.comments}
              </StatsRow>
            </PostBox>
          ))}
          <MoreInfoBox>
            <MoreText>더 많은 정보를 얻고싶으면?</MoreText>
            <ViewAllBtn to="/community">전체보기 &gt;</ViewAllBtn>
          </MoreInfoBox>
        </PostCol>
      </ListRow>
    </Container>
  </Wrapper>
);

export default PopularPosts;
