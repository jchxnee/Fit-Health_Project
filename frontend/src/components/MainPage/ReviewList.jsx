import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from 'react-icons/fi'; // 사용되지 않아 제거 고려
import { FaRegEye, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import basicProfile from '../../../public/img/basicProfile.jpg';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import media from '../../utils/media'; // media 헬퍼 함수 임포트

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[12]} 0 ${theme.spacing[24]} 0`};

  ${media.md`
    margin: ${({ theme }) => `${theme.spacing[8]} 0 ${theme.spacing[16]} 0`};
  `}
  ${media.sm`
    margin: ${({ theme }) => `${theme.spacing[6]} 0 ${theme.spacing[12]} 0`};
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
  padding: ${({ theme }) => `${theme.spacing[4]} 0 ${theme.spacing[1]} 0`};
  text-decoration: none; // Link 기본 스타일 제거
  color: inherit; // 텍스트 색상 상속

  &:last-child {
    border-bottom: none;
  }

  ${media.md`
    padding: ${({ theme }) => `${theme.spacing[3]} 0 ${theme.spacing[1]} 0`};
  `}
  ${media.sm`
    padding: ${({ theme }) => `${theme.spacing[2]} 0 ${theme.spacing[1]} 0`};
  `}
`;

const PostWriter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: left;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
    gap: ${({ theme }) => theme.spacing[1]};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
`;

const ProfileImg = styled.img`
  width: ${({ theme }) => theme.spacing[6]};
  height: ${({ theme }) => theme.spacing[6]};
  border-radius: 50%;
  object-fit: cover;

  ${media.md`
    width: ${({ theme }) => theme.spacing[5]};
    height: ${({ theme }) => theme.spacing[5]};
  `}
  ${media.sm`
    width: ${({ theme }) => theme.spacing[4]};
    height: ${({ theme }) => theme.spacing[4]};
  `}
`;

const PostRate = styled.div``;

const StarWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};

  svg {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  ${media.md`
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    svg {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  `}
  ${media.sm`
    svg {
      font-size: ${({ theme }) => theme.fontSizes.xs};
    }
  `}
`;

const PostContent = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: pre-line;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; // 3줄로 제한
  -webkit-box-orient: vertical;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    -webkit-line-clamp: 2; // 2줄로 제한
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xxs};
    -webkit-line-clamp: 2;
  `}
`;

const StatsTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fontSizes.xs};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xxs};
  `}
`;

const LoaderWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.md`
    min-height: 200px;
  `}
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

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

const ReviewList = ({ reviews, isLoading }) => {
  const leftPosts = reviews.slice(0, 3);
  const rightPosts = reviews.slice(3, 6);

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <Title>리뷰</Title>
          <LoaderWrapper>
            <BeatLoader color="#d1d5db" />
          </LoaderWrapper>
        </Container>
      </Wrapper>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Wrapper>
        <Container>
          <Title>리뷰</Title>
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#999' }}>최근 리뷰가 없습니다.</div>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Title>리뷰</Title>
        <ListRow>
          <PostCol>
            {leftPosts.map((r) => (
              <PostBox key={r.review_no} to={`/coachReview/${r.trainer_no}`}>
                <PostWriter>
                  <ProfileImg
                    src={r.profile_image ? `${CLOUDFRONT_URL}${r.profile_image}?v=${Date.now()}` : basicProfile}
                    alt={`${r.user_name}의 프로필`}
                  />
                  {r.user_name} ({r.trainer_name} 트레이너)
                </PostWriter>
                <PostRate>
                  <StarRating rating={r.rating} />
                </PostRate>
                <PostContent>{r.review_content}</PostContent>
                <StatsTime>{formatTimeAgo(r.created_date)}</StatsTime>
              </PostBox>
            ))}
          </PostCol>
          <PostCol>
            {rightPosts.map((r) => (
              <PostBox key={r.review_no} to={`/coachReview/${r.trainer_no}`}>
                <PostWriter>
                  <ProfileImg
                    src={r.profile_image ? `${CLOUDFRONT_URL}${r.profile_image}?v=${Date.now()}` : basicProfile}
                    alt={`${r.user_name}의 프로필`}
                  />
                  {r.user_name} ({r.trainer_name} 트레이너)
                </PostWriter>
                <PostRate>
                  <StarRating rating={r.rating} />
                </PostRate>
                <PostContent>{r.review_content}</PostContent>
                <StatsTime>{formatTimeAgo(r.created_date)}</StatsTime>
              </PostBox>
            ))}
          </PostCol>
        </ListRow>
      </Container>
    </Wrapper>
  );
};

export default ReviewList;
