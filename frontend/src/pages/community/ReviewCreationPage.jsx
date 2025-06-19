import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaCamera, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import api from '../../api/axios.js'; // axios 인스턴스 임포트
import { API_ENDPOINTS } from '../../api/config.js'; // API 엔드포인트 임포트

function ReviewCreationPage() {
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(0);
  // 변경: paymentId를 information 상태에 추가합니다.
  // 실제 사용 시에는 이 paymentId를 동적으로 받아와야 합니다.
  // 예를 들어, 목록에서 리뷰 작성 버튼을 클릭할 때 해당 paymentId를 넘겨주거나,
  // URL 쿼리 파라미터에서 읽어오는 방식 등을 고려해야 합니다.
  // 여기서는 임시로 하드코딩된 값(예: 1)을 사용하여 테스트하겠습니다.
  const [information] = useState({ coachName: '김성은', paymentId: 1 }); // paymentId 추가
  const contentTextareaRef = useRef(null);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const starRatingRef = useRef(null);

  // 내용과 별점, 그리고 paymentId가 모두 유효한지 확인하는 함수
  // information.paymentId가 유효한지도 확인합니다.
  const isFormValid = content.trim() !== '' && selectedRating > 0 && information.paymentId != null;

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = () => {
    setImageCount((prevCount) => Math.min(prevCount + 1, 15));
    // 실제 이미지 업로드 로직 추가 필요 (백엔드와 연동)
    alert('이미지 업로드 기능은 현재 구현되지 않았습니다.');
  };

  const handleSubmit = async () => {
    // 비동기 함수로 변경
    if (!isFormValid) {
      console.log('폼이 유효하지 않습니다. 내용, 별점, Payment ID를 모두 확인해주세요.');
      alert('리뷰 내용을 입력하고 별점을 선택해주세요.'); // 사용자에게 더 명확한 메시지
      return;
    }

    const reviewPayload = {
      paymentId: information.paymentId, // information 상태에서 paymentId 사용
      reviewContent: content,
      rating: selectedRating,
      heart: 0, // 프론트에서 heart를 따로 입력받지 않는다면 0 또는 기본값 설정
    };

    console.log('전송할 리뷰 데이터:', reviewPayload);

    try {
      // 백엔드 API 호출
      const response = await api.post(API_ENDPOINTS.REVIEW.CREATE, reviewPayload);
      console.log('리뷰 등록 성공:', response.data);
      alert('리뷰가 성공적으로 등록되었습니다!');

      // 성공 후 상태 초기화 (페이지 이동 없음, 현재 페이지 유지)
      setContent('');
      setImageCount(0);
      setSelectedRating(0);
      setHoverRating(0);
      setIsContentFocused(false);
      // textarea 초기화를 위해 ref를 사용할 수도 있습니다.
      // if (contentTextareaRef.current) {
      //   contentTextareaRef.current.value = '';
      // }
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      // 서버에서 전달된 에러 메시지가 있다면 표시
      const errorMessage = error.response?.data?.message || '리뷰 등록에 실패했습니다.';
      alert(errorMessage);
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

  // 마우스 움직임 감지하여 0.5점 단위로 별점 계산
  const handleStarMouseMove = (e) => {
    if (!starRatingRef.current) return;

    const { left, width } = starRatingRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const starWidth = width / 5;

    let calculatedRating = 0;
    for (let i = 0; i < 5; i++) {
      const starStart = i * starWidth;
      const starEnd = (i + 1) * starWidth;

      if (x >= starStart && x < starEnd) {
        const relativeX = x - starStart;
        if (relativeX <= starWidth / 2) {
          calculatedRating = i + 0.5;
        } else {
          calculatedRating = i + 1;
        }
        break;
      }
    }
    setHoverRating(calculatedRating);
  };

  // 별점 클릭 시 0.5점 단위로 별점 설정
  const handleStarClick = (e) => {
    if (!starRatingRef.current) return;

    const { left, width } = starRatingRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const starWidth = width / 5;

    let clickedRating = 0;
    for (let i = 0; i < 5; i++) {
      const starStart = i * starWidth;
      const starEnd = (i + 1) * starWidth;

      if (x >= starStart && x < starEnd) {
        const relativeX = x - starStart;
        if (relativeX <= starWidth / 2) {
          clickedRating = i + 0.5;
        } else {
          clickedRating = i + 1;
        }
        break;
      }
    }
    setSelectedRating(clickedRating);
  };

  const getTooltipMessage = () => {
    if (content.trim() === '') {
      return '내용을 입력해주세요';
    }
    if (selectedRating === 0) {
      return '별점을 선택해주세요';
    }
    return '';
  };

  return (
    <>
      <PageContainer>
        <TitleBar title="리뷰 등록" />
        <ContentWrapper>
          <TopSection>
            {/* information.coachName 사용 */}
            <CategorySelect>{information.coachName} 트레이너</CategorySelect>
            <StarRatingContainer
              ref={starRatingRef}
              onMouseMove={handleStarMouseMove}
              onClick={handleStarClick}
              onMouseLeave={() => setHoverRating(0)}
            >
              {renderStars(hoverRating || selectedRating)}
            </StarRatingContainer>
            <SubmitButtonWrapper>
              <SubmitTextButton onClick={handleSubmit} disabled={!isFormValid} $isValid={isFormValid}>
                등록
              </SubmitTextButton>
              {!isFormValid && <Tooltip>{getTooltipMessage()}</Tooltip>}
            </SubmitButtonWrapper>
          </TopSection>

          <UploadSection>
            <UploadButton onClick={handleImageUpload}>
              <FaCamera size={20} />
            </UploadButton>
            <ImageCount>{imageCount}/15</ImageCount>
          </UploadSection>
          <ContentTextareaContainer>
            {content === '' && !isContentFocused && (
              <OverlayPlaceholder>
                <p>핏코치에 대한 리뷰를 남겨주세요!</p>
                <p>예) 오늘 레슨이 특히 꼼꼼하게 봐주셔서 너무 좋았어요.</p>
                <p>예) 저번 레슨은 너무 힘들게 진행하셔서 몸이 아팠어요.</p>
                <div className="guidelines">
                  <p>※ 주제에 맞지 않는 글이나 커뮤니티 이용규정에 위배되는 글은 삭제의 대상이 됩니다.</p>
                  <p>※ 일정 수 이상의 신고를 받으면 작성한 글이 숨김 및 삭제될 수 있습니다.</p>
                </div>
              </OverlayPlaceholder>
            )}
            <ContentTextarea
              ref={contentTextareaRef}
              value={content}
              onChange={handleContentChange}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
            />
          </ContentTextareaContainer>
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default ReviewCreationPage;

// --- 스타일 컴포넌트 ---
// (이전과 동일하므로 생략하지만, 실제 코드에는 포함되어야 합니다.)
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
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
`;

const CategorySelect = styled.div`
  position: relative;
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-right: auto;
`;

const StarRatingContainer = styled.div`
  display: flex;
  gap: 2px;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.star};
  cursor: pointer;
  margin-left: auto;
  margin-right: ${({ theme }) => theme.spacing['3']};
  width: calc(${({ theme }) => theme.fontSizes.xl} * 5 + 8px);
`;

const StarIcon = styled.span`
  color: inherit;
  pointer-events: none;
`;

const SubmitButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SubmitTextButton = styled.button`
  background: none;
  border: none;
  color: ${({ $isValid, theme }) => ($isValid ? theme.colors.primary : theme.colors.gray['400'])};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: ${({ $isValid }) => ($isValid ? 'pointer' : 'not-allowed')};
  outline: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    text-decoration: ${({ $isValid }) => ($isValid ? 'underline' : 'none')};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.gray['800']};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(5px);
  transition: all 0.3s ease;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 20;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.colors.gray['800']};
  }

  ${SubmitButtonWrapper}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const UploadSection = styled.div`
  display: flex;
  height: 70px;
  padding: ${({ theme }) => theme.spacing['1']} ${({ theme }) => theme.spacing['3']};
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  background-color: ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const UploadButton = styled.button`
  background-color: ${({ theme }) => theme.colors.gray['200']};
  color: ${({ theme }) => theme.colors.gray['600']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['300']};
  }
`;

const ImageCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['600']};
`;

const ContentTextareaContainer = styled.div`
  position: relative;
  text-align: start;
  width: 100%;
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing['3']};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  background: transparent;
  resize: none;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  border: none;

  &:focus {
    outline: none;
  }
`;

const OverlayPlaceholder = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing['3']};
  left: ${({ theme }) => theme.spacing['3']};
  right: ${({ theme }) => theme.spacing['3']};
  bottom: ${({ theme }) => theme.spacing['3']};
  pointer-events: none;
  color: ${({ theme }) => theme.colors.gray['500']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.5;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};

  p {
    margin: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing['1']};
    position: relative;
    padding-left: 10px;

    &::before {
      position: absolute;
      left: 0;
      top: 0;
      color: ${({ theme }) => theme.colors.gray['600']};
    }
  }

  .guidelines {
    margin-top: ${({ theme }) => theme.spacing['4']};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.gray['500']};

    p {
      margin: 0;
    }
  }
`;
