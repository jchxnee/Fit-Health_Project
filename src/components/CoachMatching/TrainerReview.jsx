import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from 'react-icons/fi';
import { FaRegEye, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[12]} 0 ${theme.spacing[24]} 0`};
`;

const Container = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h2`
  text-align: left;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ContentAndMoreWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const PostsColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 480px;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PostBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => `${theme.spacing[4]} 0 ${theme.spacing[1]} 0`};
  width: ${({ theme }) => theme.width.lg};
`;

const PostWriter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-align: left;
`;

const ProfileImg = styled.img`
  width: ${({ theme }) => theme.spacing[6]};
  height: ${({ theme }) => theme.spacing[6]};
  border-radius: 50%;
  object-fit: cover;
`;

const PostRate = styled.div``;

const StarWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PostContent = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: pre-line;
  text-align: left;
`;

const StatsTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fontSizes.xxs};
`;

const MoreInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: ${({ theme }) => theme.spacing[16]};
`;

const MoreText = styled.button`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
`;

const StarRating = ({ rating = 0 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#FFD700" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
    } else {
      stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
  }

  return <StarWrapper>{stars}</StarWrapper>;
};

const posts = [
  {
    writer: '김현아',
    profileUrl:
      'https://i.namu.wiki/i/Iha7pt4ahAfLRN22YiVjcl24Xeigb3nNv84nfKZ8r-Y2LhWQBy6gAz0zatiWz8_iFhq-ZP5V-JXrXMAiZwIWzw.webp',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다. 특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    time: '방금 전',
    rate: 4.5,
  },
  {
    writer: '이주찬',
    profileUrl: 'https://via.placeholder.com/24x24?text=LC',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다. 특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    time: '방금 전',
    rate: 5,
  },
  {
    writer: '황인태',
    profileUrl: 'https://via.placeholder.com/24x24?text=HT',
    content:
      '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다. 특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.',
    time: '방금 전',
    rate: 3,
  },
];

const TrainerReview = () => (
  <Wrapper>
    <Container>
      <Title>리뷰</Title>
      <ContentAndMoreWrapper>
        <PostsColumn>
          {posts.slice(0, 3).map((p, i) => (
            <PostBox key={i}>
              <PostWriter>
                <ProfileImg src={p.profileUrl} alt={`${p.writer}의 프로필`} />
                {p.writer}
              </PostWriter>
              <PostRate>
                <StarRating rating={p.rate} />
              </PostRate>
              <PostContent>{p.content}</PostContent>
              <StatsTime>{p.time}</StatsTime>
            </PostBox>
          ))}
        </PostsColumn>
        <MoreInfoBox>
          <MoreText>리뷰 더보기</MoreText>
        </MoreInfoBox>
      </ContentAndMoreWrapper>
    </Container>
  </Wrapper>
);

export default TrainerReview;
