import React, { useState, useRef, useEffect, useMemo } from 'react'; // useMemo 추가
import styled from 'styled-components';
import Header from '../components/Header'; // 실제 Header 컴포넌트 경로로 변경
import Footer from '../components/Footer'; // 실제 Footer 컴포넌트 경로로 변경
import betaImg from '../assets/beta_user_img.png'; // 더미 사용자 프로필 이미지 및 후기 내 등 사진으로 사용
import { FaChevronDown, FaThumbsUp, FaRegThumbsUp, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import TitleBar from '../components/TitleBar'; // TitleBar 컴포넌트 경로 확인

function CoachReview() {
  const [user] = useState({ name: '김현아', img: betaImg }); // 현재 로그인 사용자 정보 (더미)
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('highestRating'); // 초기 정렬 기준: 높은순
  const sortMenuRef = useRef(null);

  // 더미 코치 후기 데이터
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: '김하나님',
      authorProfileImg: betaImg,
      timeAgo: '1시간 전',
      rating: 4.5,
      content: '트레이너분이 친절하시고 잘 알려주셔서 운동하기 좋았어요! -ㅇ-👍',
      reviewBodyImage: betaImg,
      recommendCount: 5,
      isRecommended: false,
    },
    {
      id: 2,
      author: '김하나님',
      authorProfileImg: betaImg,
      timeAgo: '1시간 전',
      rating: 3.0,
      content: '트레이너분이 친절하시고 잘 알려주셔서 운동하기 좋았어요! -ㅇ-👍',
      reviewBodyImage: '',
      recommendCount: 8,
      isRecommended: false,
    },
    {
      id: 3,
      author: '박트레이닝',
      authorProfileImg: betaImg,
      timeAgo: '30분 전',
      rating: 2.5,
      content: '운동 설명이 자세해서 좋았어요.',
      reviewBodyImage: '',
      recommendCount: 10,
      isRecommended: true,
    },
    {
      id: 4,
      author: '이운동',
      authorProfileImg: betaImg,
      timeAgo: '2시간 전',
      rating: 5.0,
      content: '최고의 트레이너입니다!',
      reviewBodyImage: '',
      recommendCount: 15,
      isRecommended: false,
    },
    {
      id: 5,
      author: '최강체력',
      authorProfileImg: betaImg,
      timeAgo: '5분 전',
      rating: 1.0,
      content: '좀 아쉬운 부분이 있었어요.',
      reviewBodyImage: '',
      recommendCount: 2,
      isRecommended: false,
    },
  ]);

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
        // 'timeAgo'가 문자열이므로 실제 날짜/시간 객체로 변환하여 비교하거나,
        // 실제 데이터베이스에서는 타임스탬프를 사용하여 비교하는 것이 좋습니다.
        // 여기서는 간단히 id를 역순으로 (가장 최근에 추가된 것이 id가 높다고 가정)
        return reviewsCopy.sort((a, b) => b.id - a.id); // 최신순 (id 기준)
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

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="코치 후기" /> {/* TitleBar 컴포넌트 사용 */}
        <MainContentWrapper>
          <CoachInfoSection>
            <CoachName>김성은 트레이너</CoachName>
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
                <ProfileImageSmall src={review.authorProfileImg || betaImg} alt={review.author} />
                <AuthorInfoReview>
                  <AuthorNameReview>{review.author}</AuthorNameReview>
                  <TimeAgoReview>{review.timeAgo}</TimeAgoReview>
                </AuthorInfoReview>
                <Rating>
                  {renderStars(review.rating)} <RatingText>{review.rating.toFixed(1)}</RatingText>
                </Rating>
              </ReviewHeader>
              {review.reviewBodyImage && <ReviewBodyImage src={review.reviewBodyImage} alt="Review body image" />}
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
      <Footer />
    </>
  );
}

export default CoachReview;

// --- 스타일 컴포넌트 ---

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
