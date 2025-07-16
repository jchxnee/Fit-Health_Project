import React from 'react';
import styled from 'styled-components';
import { FaRegEye, FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import media from '../../utils/media'; // media 헬퍼 함수 임포트

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[24]} 0 ${theme.spacing[24]} 0`};

  ${media.md`
    margin: ${({ theme }) => `${theme.spacing[16]} 0`};
  `}
  ${media.sm`
    margin: ${({ theme }) => `${theme.spacing[12]} 0`};
  `}
`;
const Container = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: 0 ${({ theme }) => theme.spacing[4]}; // 좌우 패딩 추가
  box-sizing: border-box;

  ${media.lg`
    width: 90%;
  `}
  ${media.md`
    width: 95%;
    gap: ${({ theme }) => theme.spacing[6]};
  `}
`;
const Title = styled.h2`
  text-align: left;
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
`;
const ListRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]}; // 기존 갭
  flex-direction: row; // 기본은 가로 정렬

  ${media.md`
    gap: ${({ theme }) => theme.spacing[8]};
  `}
  ${media.sm`
    flex-direction: column; // 작은 화면에서 세로 정렬
    gap: ${({ theme }) => theme.spacing[4]};
  `}
`;
const PostCol = styled.div`
  width: 480px; // 기본 너비
  display: flex;
  flex-direction: column;
  gap: 0; // PostBox의 border-bottom으로 간격 조절

  ${media.lg`
    width: 50%; // 큰 화면에서 50%로 유연하게
  `}
  ${media.md`
    width: 50%; // 중간 화면에서 50% 유지
  `}
  ${media.sm`
    width: 100%; // 작은 화면에서 100% 너비
  `}
`;
const PostBox = styled(Link)`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => `${theme.spacing[4]} 0 ${theme.spacing[2]} 0`};
  text-decoration: none; // Link 기본 스타일 제거
  color: inherit; // 텍스트 색상 상속

  &:last-child {
    // 마지막 항목의 하단 보더 제거 (ReviewList와 일관성 위해)
    border-bottom: none;
  }

  ${media.md`
    padding: ${({ theme }) => `${theme.spacing[3]} 0 ${theme.spacing[1]} 0`};
  `}
  ${media.sm`
    padding: ${({ theme }) => `${theme.spacing[2]} 0 ${theme.spacing[1]} 0`};
  `}
`;
const PostTitle = styled.div`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: left;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
`;
const PostContent = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: pre-line;
  text-align: left;
  overflow: hidden; // 내용이 길어지면 숨김
  text-overflow: ellipsis; // ...으로 표시
  display: -webkit-box;
  -webkit-line-clamp: 2; // 2줄로 제한
  -webkit-box-orient: vertical;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    -webkit-line-clamp: 1; // 1줄로 제한
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xxs};
  `}
`;
const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    svg {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xxs};
    svg {
      font-size: ${({ theme }) => theme.fontSizes.xs};
    }
  `}
`;

const MoreInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[4]}; // 상단 여백 추가 (목록 하단에 배치될 때)

  ${media.md`
    gap: ${({ theme }) => theme.spacing[1]};
    padding-top: ${({ theme }) => theme.spacing[2]};
  `}
  ${media.sm`
    align-items: center; // 모바일에서 중앙 정렬
    padding-top: ${({ theme }) => theme.spacing[1]};
  `}
`;
const MoreText = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
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
  text-decoration: none; // Link 기본 스타일 제거

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;
const LoaderWrapper = styled.div`
  width: 100%;
  min-height: 300px; /* 충분한 높이 확보 */
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.md`
    min-height: 200px;
  `}
`;

const PopularPosts = ({ boards, isLoading }) => {
  const leftPosts = boards.slice(0, 3);
  const rightPosts = boards.slice(3, 5); // 2개만 보여줌

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
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#999' }}>최근 게시글이 없습니다.</div>
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
            {/* 오른쪽 칼럼은 모바일에서 두 번째 섹션처럼 보이도록 */}
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
