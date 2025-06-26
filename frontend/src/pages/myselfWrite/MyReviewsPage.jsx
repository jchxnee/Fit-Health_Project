import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaChevronDown, FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';
import { toast } from 'react-toastify';

function MyReviewsPage() {
  const location = useLocation();
  const userEmail = location.state?.userEmail;

  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sortMenuRef = useRef(null);

  const [modalOpenReviewId, setModalOpenReviewId] = useState(null);
  const modalRef = useRef(null);

  // 백엔드에서 리뷰 데이터를 가져오는 함수
  const fetchMyReviews = async (email, currentSortCriteria) => {
    if (!email) {
      // toast.error('사용자 이메일 정보가 없습니다.');
      setLoading(false);
      setError('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    setLoading(true);
    setError(null); // 새로운 요청 전에 에러 초기화

    try {
      const response = await api.get(API_ENDPOINTS.REVIEW.MYREVIEW, {
        params: { userEmail: email }, // 쿼리 파라미터로 userEmail 전달
      });
      console.log('백엔드에서 받은 리뷰 데이터:', response.data);
      const fetchedReviews = response.data.map((review) => ({
        id: review.reviewId,
        coachName: review.trainerName,
        date: review.createdAt.split('T')[0].replace(/-/g, '.'),
        rating: review.rating,
        content: review.reviewContent,
        imageUrl: review.imageUrl,
        recommendCount: review.recommendCount || 0,
        isRecommended: review.isRecommended || false,
      }));

      const sortedFetchedReviews = [...fetchedReviews].sort((a, b) => {
        if (currentSortCriteria === 'highestRating') {
          return b.rating - a.rating;
        } else if (currentSortCriteria === 'lowestRating') {
          return a.rating - b.rating;
        } else if (currentSortCriteria === 'latest') {
          const dateA = new Date(a.date.replace(/\./g, '-'));
          const dateB = new Date(b.date.replace(/\./g, '-'));
          return dateB - dateA;
        }
        return 0;
      });

      setReviews(sortedFetchedReviews);
    } catch (err) {
      console.error('리뷰 데이터를 불러오는 데 실패했습니다:', err);
      setError('리뷰 데이터를 불러오는 데 실패했습니다.');
      toast.error('리뷰 데이터를 불러오는 데 실패했습니다.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews(userEmail, sortCriteria);
  }, [userEmail, sortCriteria]); // userEmail 또는 sortCriteria가 변경될 때마다 데이터 다시 불러오고 정렬

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
    toast.info('추천 기능은 현재 프론트엔드에서만 동작합니다.');
  };

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
  }, []); // 의존성 배열에서 sortMenuRef 제거 (ref는 변경되지 않음)

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
  }, []); // 의존성 배열에서 modalRef 제거 (ref는 변경되지 않음)

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

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      try {
        // 백엔드 삭제 API 호출 (DELETE /api/review/{reviewId} 가정)
        await api.delete(`${API_ENDPOINTS.REVIEW.DELETE}${reviewId}`);
        toast.success('리뷰가 삭제되었습니다.');
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      } catch (err) {
        console.error('리뷰 삭제 실패:', err);
        toast.error('리뷰 삭제에 실패했습니다.');
      } finally {
        setModalOpenReviewId(null);
      }
    } else {
      setModalOpenReviewId(null);
    }
  };

  // MenuButton 클릭 핸들러: 해당 리뷰의 모달 열기/닫기 토글
  const handleMenuButtonClick = (id) => {
    setModalOpenReviewId(modalOpenReviewId === id ? null : id);
  };

  if (loading) {
    return (
      <PageContainer>
        <TitleBar title="내가 쓴 리뷰" />
        <ContentWrapper>
          <LoadingMessage>리뷰를 불러오는 중입니다...</LoadingMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <TitleBar title="내가 쓴 리뷰" />
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <TitleBar title="내가 쓴 리뷰" />
        <ContentWrapper>
          <ReviewListSection>
            <TopReviewBar>
              <TotalReviewsCount>내가 작성한 리뷰 {reviews.length}개</TotalReviewsCount>
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
                      <MenuButtonWrapper>
                        <MenuButton onClick={() => handleMenuButtonClick(review.id)}>
                          <IoMdMore size={20} color="#9E9E9E" />
                        </MenuButton>
                        {modalOpenReviewId === review.id && (
                          <ReviewActionsModal ref={modalRef}>
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
            {reviews.length === 0 && !loading && !error && <NoReviewsMessage>작성한 리뷰가 없습니다.</NoReviewsMessage>}
          </ReviewListSection>
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default MyReviewsPage;

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

const NoReviewsMessage = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-top: ${({ theme }) => theme.spacing['8']};
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray['600']};
  margin-top: ${({ theme }) => theme.spacing['8']};
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: red;
  margin-top: ${({ theme }) => theme.spacing['8']};
`;
