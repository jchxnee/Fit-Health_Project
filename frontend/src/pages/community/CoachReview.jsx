// src/pages/CoachReview.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaThumbsUp, FaRegThumbsUp, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import TitleBar from '../../components/TitleBar';
import betaImg from '../../assets/beta_user_img.png';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

function CoachReview() {
  const { trainerNo } = useParams(); // URL에서 trainerEmail 가져오기
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('highestRating'); // 초기 정렬 기준: 높은순
  const sortMenuRef = useRef(null);

  const [reviews, setReviews] = useState([]); // 실제 리뷰 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const [trainerName, setTrainerName] = useState('');

  // '높은 순' 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // API로부터 리뷰 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchReviews = async () => {
      if (!trainerNo) {
        // trainerEmail이 없으면 API 호출하지 않음
        setLoading(false);
        setError('트레이너 이메일이 제공되지 않았습니다.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const trainerResponse = await api.get(`${API_ENDPOINTS.COACH.LIST}/${trainerNo}`);
        setTrainerName(trainerResponse.data.trainerName);
        console.log('백에서 가져온 트레이너 데이터 : ', trainerResponse.data);
        const response = await api.get(`${API_ENDPOINTS.REVIEW.SELECT}${trainerNo}`);
        // 백엔드 DTO 구조에 맞춰 데이터 매핑
        const fetchedReviews = response.data.map((review) => ({
          id: review.reviewId, // 백엔드 reviewId를 id로 매핑
          author: review.userName, // userName을 author로
          authorProfileImg: review.userProfileImage || betaImg, // userProfileImage를 authorProfileImg로
          timeAgo: new Date(review.createdAt).toLocaleDateString(), // createdAt을 timeAgo로 간단히 변환
          rating: review.rating,
          content: review.reviewContent,
          reviewBodyImage: review.reviewImage || '', // reviewImage를 reviewBodyImage로
          recommendCount: review.recommendCount,
          isRecommended: false, // 이 부분은 서버에서 받아오거나 클라이언트에서 관리
        }));
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [trainerNo]); // trainerEmail이 변경될 때마다 리뷰를 다시 불러옴

  // 별점 렌더링 함수 (FaStar, FaStarHalfAlt, FaRegStar 사용)
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    // 꽉 찬 별
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    // 반쪽 별
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: 'lightgray' }} />); // 빈 별은 FaRegStar 사용
    }

    return stars;
  };

  // 추천 버튼 토글 핸들러
  const handleRecommendToggle = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              isRecommended: !review.isRecommended,
              recommendCount: review.isRecommended ? review.recommendCount - 1 : review.recommendCount + 1,
            }
          : review
      )
    );
  };

  // 정렬된 후기 데이터를 반환하는 useMemo
  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...reviews]; // 원본 배열을 변경하지 않기 위해 복사
    switch (sortCriteria) {
      case 'highestRating':
        return reviewsCopy.sort((a, b) => b.rating - a.rating); // 높은 순
      case 'lowestRating':
        return reviewsCopy.sort((a, b) => a.rating - b.rating); // 낮은 순
      case 'latest':
        // `createdAt` 같은 실제 타임스탬프가 있다면 그것을 사용하고,
        // 현재는 `timeAgo`가 문자열이므로 임시로 id를 역순으로 (가장 최근에 추가된 것이 id가 높다고 가정)
        // 실제 백엔드 데이터 `createdAt` (ISO 8601) 기준으로 정렬하려면 Date 객체로 변환하여 비교:
        return reviewsCopy.sort((a, b) => new Date(b.timeAgo) - new Date(a.timeAgo));
      default:
        return reviewsCopy;
    }
  }, [reviews, sortCriteria]);

  // 드롭다운 메뉴 텍스트를 현재 정렬 기준에 따라 표시
  const getSortButtonText = () => {
    switch (sortCriteria) {
      case 'highestRating':
        return '⭐높은순';
      case 'lowestRating':
        return '⭐낮은순';
      case 'latest':
        return '최신순';
      default:
        return '정렬';
    }
  };

  if (loading) return <PageContainer>로딩 중...</PageContainer>;
  if (error) return <PageContainer>에러: {error}</PageContainer>;
  if (reviews.length === 0) return <PageContainer>등록된 리뷰가 없습니다.</PageContainer>; // 리뷰가 없을 때

  return (
    <>
      {/* <Header /> */} {/* Header와 Footer는 App.js에서 렌더링되므로 여기서는 제거해도 됨 */}
      <PageContainer>
        <TitleBar title="코치 후기" /> {/* TitleBar 컴포넌트 사용 */}
        <MainContentWrapper>
          <CoachInfoSection>
            <CoachName>{trainerName} 트레이너</CoachName>
            <ReviewCount>총 {reviews.length}개의 후기</ReviewCount>
            <SortDropdownContainer ref={sortMenuRef}>
              <SortButton onClick={() => setSortMenuOpen(!sortMenuOpen)}>
                {getSortButtonText()} <FaChevronDown size={12} color="#757575" />
              </SortButton>
              {sortMenuOpen && (
                <SortDropdownMenu>
                  <SortDropdownMenuItem
                    onClick={() => {
                      setSortCriteria('highestRating');
                      setSortMenuOpen(false);
                    }}
                  >
                    ⭐높은순
                  </SortDropdownMenuItem>
                  <SortDropdownMenuItem
                    onClick={() => {
                      setSortCriteria('lowestRating');
                      setSortMenuOpen(false);
                    }}
                  >
                    ⭐낮은순
                  </SortDropdownMenuItem>
                  <SortDropdownMenuItem
                    onClick={() => {
                      setSortCriteria('latest');
                      setSortMenuOpen(false);
                    }}
                  >
                    최신순
                  </SortDropdownMenuItem>
                </SortDropdownMenu>
              )}
            </SortDropdownContainer>
          </CoachInfoSection>

          {sortedReviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewHeader>
                <ProfileImageSmall
                  src={
                    review.authorProfileImg ? `${CLOUDFRONT_URL}${review.authorProfileImg}?v=${Date.now()}` : betaImg
                  }
                  alt={review.author}
                />
                <AuthorInfoReview>
                  <AuthorNameReview>{review.author}</AuthorNameReview>
                  <TimeAgoReview>{review.timeAgo}</TimeAgoReview>
                </AuthorInfoReview>
                <Rating>
                  {renderStars(review.rating)} <RatingText>{review.rating.toFixed(1)}</RatingText>
                </Rating>
              </ReviewHeader>
              {review.reviewBodyImage && (
                <ReviewBodyImage
                  src={`${CLOUDFRONT_URL}${review.reviewBodyImage}?v=${Date.now()}`}
                  alt="Review body image"
                />
              )}
              <ReviewContent>{review.content}</ReviewContent>
              <ReviewActions>
                <RecommendButton onClick={() => handleRecommendToggle(review.id)}>
                  {review.isRecommended ? <FaThumbsUp /> : <FaRegThumbsUp />} 추천 {review.recommendCount}
                </RecommendButton>
              </ReviewActions>
            </ReviewItem>
          ))}
        </MainContentWrapper>
      </PageContainer>
      {/* <Footer /> */}
    </>
  );
}

export default CoachReview;

// --- 스타일 컴포넌트 (변경 없음) ---

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const MainContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg}; /* 1008px */
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing['8']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  padding: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['6']};
  text-align: start; /* 기본 정렬을 왼쪽으로 설정 */
`;

const CoachInfoSection = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
`;

const CoachName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-right: ${({ theme }) => theme.spacing['3']};
`;

const ReviewCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['600']};
  margin-right: auto; /* '높은순' 드롭다운을 오른쪽으로 밀어냅니다. */
`;

const SortDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SortButton = styled.button`
  background-color: ${({ theme }) => theme.colors.gray['100']}; /* 버튼 배경색 추가 */
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['200']};
  }
`;

const SortDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  min-width: 100px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing['1']};
`;

const SortDropdownMenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['800']};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing['6']} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ProfileImageSmall = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: ${({ theme }) => theme.spacing['3']};
`;

const AuthorInfoReview = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorNameReview = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray['700']};
`;

const TimeAgoReview = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['500']};
`;

const Rating = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px; /* 별 아이콘 간 간격 조정 */
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.star}; /* 별 색상을 테마에서 가져옴 */

  svg {
    /* 별 아이콘에 직접 스타일 적용 */
    font-size: ${({ theme }) => theme.fontSizes.lg}; /* 별 아이콘 크기 */
  }
`;

const RatingText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  padding-left: ${({ theme }) => theme.spacing['2']};
`;

const ReviewBodyImage = styled.img`
  width: 150px; /* 이미지 너비 조정 */
  height: auto; /* 비율 유지 */
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  object-fit: cover;
`;

const ReviewContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};
`;

const RecommendButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 0;

  svg {
    color: ${({ theme }) => theme.colors.primary}; /* 추천 아이콘 색상 */
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  &:hover {
    opacity: 0.8;
  }
`;
