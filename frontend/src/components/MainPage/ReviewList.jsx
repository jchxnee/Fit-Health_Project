import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from 'react-icons/fi';
import { FaRegEye, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import basicProfile from '../../../public/img/basicProfile.jpg';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

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

const ListRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
`;

const PostCol = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
`;

const PostBox = styled(Link)`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => `${theme.spacing[4]} 0 ${theme.spacing[1]} 0`};
`;

const PostWriter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
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
  margin-bottom: ${({ theme }) => theme.spacing[1]};
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
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const LoaderWrapper = styled.div`
  width: 100%;
  min-height: 300px; /* 충분한 높이 확보 */
  display: flex;
  justify-content: center;
  align-items: center;
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

  return (
    <Wrapper>
      <Container>
        <Title>리뷰</Title>
        <ListRow>
          <PostCol>
            {leftPosts.map((r) => (
              <PostBox key={r.review_no} to={`/coachReview/${r.trainer_no}`}>
                <PostWriter>
                  <ProfileImg src={r.profile_image ? r.profile_image : basicProfile} alt={`${r.user_name}의 프로필`} />
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
                  <ProfileImg src={r.profile_image ? r.profile_image : basicProfile} alt={`${r.user_name}의 프로필`} />
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
