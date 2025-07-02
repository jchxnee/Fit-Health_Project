import React from 'react';
import styled from 'styled-components';
import { FaRegEye, FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

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
const PostBox = styled(Link)`
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
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`;
const ViewAllBtn = styled(Link)`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 0;
`;
const LoaderWrapper = styled.div`
  width: 100%;
  min-height: 300px; /* 충분한 높이 확보 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopularPosts = ({ boards, isLoading }) => {
  const leftPosts = boards.slice(0, 3);
  const rightPosts = boards.slice(3, 5);

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <Title>커뮤니티 인기 글</Title>
          <LoaderWrapper>
            <BeatLoader color="#d1d5db" />
          </LoaderWrapper>
        </Container>
      </Wrapper>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <Wrapper>
        <Container>
          <Title>커뮤니티 인기 글</Title>
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#999' }}>인기 게시물이 없습니다.</div>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Title>커뮤니티 인기 글</Title>
        <ListRow>
          <PostCol>
            {leftPosts.map((b) => (
              <PostBox key={b.board_no} to={`/communityDetailPage/${b.board_no}`}>
                <PostTitle>{b.board_title}</PostTitle>
                <PostContent>{b.board_content}</PostContent>
                <StatsRow>
                  <FaRegEye />
                  {b.count}
                  <FaThumbsUp />
                  {b.heart}
                </StatsRow>
              </PostBox>
            ))}
          </PostCol>
          <PostCol>
            {rightPosts.map((b) => (
              <PostBox key={b.board_no} to={`/communityDetailPage/${b.board_no}`}>
                <PostTitle>{b.board_title}</PostTitle>
                <PostContent>{b.board_content}</PostContent>
                <StatsRow>
                  <FaRegEye />
                  {b.count}
                  <FaThumbsUp />
                  {b.heart}
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
};

export default PopularPosts;
