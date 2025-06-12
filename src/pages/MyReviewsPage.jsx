import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TitleBar from '../components/TitleBar';
import { FaChevronDown, FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { BsHeartFill } from 'react-icons/bs'; // 추천 아이콘 (하트 모양으로 가정)
import betaImg from '../assets/beta_user_img.png'; // 사용자 이미지 (Header에서 사용)
import { IoMdMore } from 'react-icons/io';

// --- 더미 데이터 (실제로는 API에서 받아옴) ---
const myReviewsData = [
  {
    id: 1,
    coachName: '김성은',
    round: 2,
    date: '2025.06.07',
    rating: 4,
    content: '트레이너분이 친절하시고 잘 알려주셔서 운동하기 좋았어요! -ㅇㅎㅇㅌ-',
    imageUrl: betaImg,
    recommendCount: 5,
    isRecommended: false,
  },
  {
    id: 2,
    coachName: '김성은',
    round: 3,
    date: '2025.06.01', // 날짜 데이터 수정 (최신순 정렬 확인용)
    rating: 4.5,
    content: '트레이너분이 친절하시고 잘 알려주셔서 운동하기 좋았어요! -ㅇㅎㅇㅌ-',
    imageUrl: null, // 이미지가 없는 리뷰
    recommendCount: 5,
    isRecommended: false,
  },
  {
    id: 3,
    coachName: '이동훈',
    round: 1,
    date: '2025.06.05',
    rating: 5.0,
    content: '정말 최고입니다! 자세 교정에 큰 도움이 되었어요.',
    imageUrl: betaImg,
    recommendCount: 2,
    isRecommended: false,
  },
];

function MyReviewsPage() {
  const [user] = useState({ name: '김현아', img: betaImg }); // Header에 전달할 사용자 정보
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [reviews, setReviews] = useState(myReviewsData); // 리뷰 목록 상태
  const [sortCriteria, setSortCriteria] = useState('highestRating'); // 초기 정렬 기준: 높은순
  const sortMenuRef = useRef(null);

  // --- 모달 관련 상태 및 Ref 추가 ---
  const [modalOpenReviewId, setModalOpenReviewId] = useState(null); // 현재 모달이 열린 리뷰의 ID
  const modalRef = useRef(null); // 모달 외부 클릭 감지를 위한 Ref

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

  // 컴포넌트 마운트 시 또는 정렬 기준 변경 시 리뷰 정렬
  useEffect(() => {
    const sortedReviews = [...myReviewsData].sort((a, b) => {
      if (sortCriteria === 'highestRating') {
        return b.rating - a.rating; // 높은 별점순 (내림차순)
      } else if (sortCriteria === 'lowestRating') {
        return a.rating - b.rating; // 낮은 별점순 (오름차순)
      } else if (sortCriteria === 'latest') {
        // 날짜를 Date 객체로 변환하여 비교 (YYYY.MM.DD 형식 가정)
        const dateA = new Date(a.date.replace(/\./g, '-')); // "YYYY.MM.DD" -> "YYYY-MM-DD"
        const dateB = new Date(b.date.replace(/\./g, '-'));
        return dateB - dateA; // 최신순 (내림차순)
      }
      return 0;
    });
    setReviews(sortedReviews);
  }, [sortCriteria]); // sortCriteria가 변경될 때마다 정렬

  // 외부 클릭 시 드롭다운 닫기 (정렬 메뉴)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [sortMenuRef]);

  // 외부 클릭 시 모달 닫기 (수정/삭제 모달)
  useEffect(() => {
    const handleModalOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpenReviewId(null); // 모달 닫기
      }
    };
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, [modalRef]);

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

  // 별점 렌더링 함수 (0.5점 단위 표시 지원)
  const renderStars = (ratingToDisplay) => {
    const stars = [];
    const fullStars = Math.floor(ratingToDisplay);
    const hasHalfStar = ratingToDisplay % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={`star-${i}`} />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={`half-star-${i}`} />);
      } else {
        stars.push(<FaRegStar key={`empty-${i}`} style={{ color: 'lightgray' }} />);
      }
    }
    return stars;
  };

  // 리뷰 수정 핸들러
  const handleEditReview = (reviewId) => {
    alert(`리뷰 ID: ${reviewId} 수정 기능 구현 예정`);
    setModalOpenReviewId(null); // 모달 닫기
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews); // 상태 업데이트
      alert('리뷰가 삭제되었습니다.');
    }
    setModalOpenReviewId(null); // 모달 닫기
  };

  // MenuButton 클릭 핸들러: 해당 리뷰의 모달 열기/닫기 토글
  const handleMenuButtonClick = (id) => {
    setModalOpenReviewId(modalOpenReviewId === id ? null : id);
  };

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="내가 쓴 리뷰" />
        <ContentWrapper>
          <ReviewListSection>
            <TopReviewBar>
              <TotalReviewsCount>내가 쓴 리뷰 {reviews.length}개</TotalReviewsCount>
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
            </TopReviewBar>
            {reviews.map((review) => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <CoachInfo>
                    <MenuMini>
                      <CoachName>{review.coachName} 트레이너</CoachName>
                      {/* MenuButton의 position을 relative로 설정하여 모달의 기준점 제공 */}
                      <MenuButtonWrapper>
                        <MenuButton onClick={() => handleMenuButtonClick(review.id)}>
                          <IoMdMore size={20} color="#9E9E9E" /> {/* 아이콘 색상 추가 */}
                        </MenuButton>
                        {modalOpenReviewId === review.id && (
                          <ReviewActionsModal ref={modalRef}>
                            <ModalActionButton onClick={() => handleEditReview(review.id)}>수정</ModalActionButton>
                            <ModalActionButton onClick={() => handleDeleteReview(review.id)}>삭제</ModalActionButton>
                          </ReviewActionsModal>
                        )}
                      </MenuButtonWrapper>
                    </MenuMini>
                    <ReviewDate>{review.date}</ReviewDate>
                  </CoachInfo>
                  <StarRatingContainer>
                    {renderStars(review.rating)}
                    <RatingText>{review.rating.toFixed(1)}</RatingText>
                  </StarRatingContainer>
                </ReviewHeader>
                <ReviewBody>{review.imageUrl && <ReviewImage src={review.imageUrl} alt="Review" />}</ReviewBody>
                <ReviewBodyMini>
                  <ReviewContent>{review.content}</ReviewContent>
                  <RecommendButton onClick={() => handleRecommendToggle(review.id)}>
                    {review.isRecommended ? <FaThumbsUp /> : <FaRegThumbsUp />} 추천 {review.recommendCount}
                  </RecommendButton>
                </ReviewBodyMini>
              </ReviewCard>
            ))}
            {reviews.length === 0 && <NoReviewsMessage>작성한 리뷰가 없습니다.</NoReviewsMessage>}
          </ReviewListSection>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}

export default MyReviewsPage;

// --- 스타일 컴포넌트 ---

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
`;

const TopReviewBar = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SortDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SortButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};
  background-color: ${({ theme }) => theme.colors.white}; /* 배경색 추가 */

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

const TotalReviewsCount = styled.div`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['700']};
`;

const ReviewListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const ReviewCard = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  padding: ${({ theme }) => theme.spacing['4']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  position: relative; /* 모달 위치 설정을 위해 추가 */
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const CoachInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
`;
const MenuMini = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const MenuButtonWrapper = styled.div`
  position: relative; /* 모달의 기준점 */
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

// --- 모달 스타일 컴포넌트 추가 ---
const ReviewActionsModal = styled.div`
  position: absolute;
  top: 100%; /* MenuButtonWrapper 바로 아래에 위치 */
  left: 0; /* MenuButtonWrapper의 오른쪽에 정렬 */
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 20; /* 다른 요소 위에 표시 */
  display: flex;
  flex-direction: column;
  min-width: 80px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing['1']};
`;

const ModalActionButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['800']};
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;
// --- 모달 스타일 컴포넌트 추가 끝 ---

const CoachName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const ReviewDate = styled.span`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['400']};
`;

const ReviewBody = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  align-items: flex-start;
`;
const ReviewBodyMini = styled.div`
  display: flex;
  justify-content: space-between; /* 내용과 추천 버튼을 좌우로 분리 */
  align-items: flex-end; /* 추천 버튼이 아래에 정렬되도록 */
`;

const ReviewImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex-shrink: 0; /* 이미지가 줄어들지 않도록 */
`;

const ReviewContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1; /* 남은 공간을 차지하도록 */
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
  flex-shrink: 0; /* 버튼이 줄어들지 않도록 */

  svg {
    color: ${({ theme }) => theme.colors.primary}; /* 추천 아이콘 색상 */
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  &:hover {
    opacity: 0.8;
  }
`;

const ReviewFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing['3']};
  padding-top: ${({ theme }) => theme.spacing['3']};
  border-top: 1px solid ${({ theme }) => theme.colors.gray['100']};
`;

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 리뷰 페이지에서는 별 크기 조정 */
  color: ${({ theme }) => theme.colors.star};
`;

const RatingText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  padding-left: ${({ theme }) => theme.spacing['2']};
`;

const Recommendation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['600']};

  svg {
    transform: translateY(-1px); /* 하트 아이콘 미세 조정 */
  }
`;

const NoReviewsMessage = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-top: ${({ theme }) => theme.spacing['8']};
`;
