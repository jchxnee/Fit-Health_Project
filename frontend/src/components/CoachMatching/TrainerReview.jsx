// src/components/CoachMatching/TrainerReview.jsx
import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from 'react-icons/fi';
import { FaRegEye, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

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
  font-size: ${({ theme }) => theme.fontSizes.xs};
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

// 더미 데이터는 CoachReview.jsx에서 관리하고, 여기서는 props로 받아옵니다.
// 이 컴포넌트 자체에서 API 호출을 할 필요는 없습니다.
// TrainerReview는 CoachDetail의 일부로, 리뷰 목록의 요약본을 보여주는 역할입니다.

const TrainerReview = (
  { trainerEmail, reviews = [] } // reviews prop 추가
) => (
  <Wrapper>
    <Container>
      <Title>리뷰</Title>
      <ContentAndMoreWrapper>
        <PostsColumn>
          {/* 받아온 reviews prop을 사용하고 slice는 여전히 3개만 보여주기 위함 */}
          {reviews.slice(0, 3).map((p) => (
            <PostBox key={p.reviewId}>
              <PostWriter>
                <ProfileImg
                  src={p.userProfileImage || 'https://via.placeholder.com/24x24?text=User'} // 기본 이미지 설정
                  alt={`${p.userName}의 프로필`}
                />
                {p.userName}
              </PostWriter>
              <PostRate>
                <StarRating rating={p.rating} />
              </PostRate>
              <PostContent>{p.reviewContent}</PostContent>
              <StatsTime>
                {new Date(p.createdAt).toLocaleDateString()} {/* 간단한 날짜 포맷팅 */}
              </StatsTime>
            </PostBox>
          ))}
        </PostsColumn>
        {/* '리뷰 더보기' 클릭 시, props로 받은 trainerEmail을 URL 파라미터로 전달 */}
        {/* trainerEmail이 있을 때만 Link를 렌더링하도록 조건부 렌더링 */}
        {trainerEmail && (
          <Link to={`/coachReview/${trainerEmail}`}>
            <MoreInfoBox>
              <MoreText>리뷰 더보기</MoreText>
            </MoreInfoBox>
          </Link>
        )}
      </ContentAndMoreWrapper>
    </Container>
  </Wrapper>
);

export default TrainerReview;
