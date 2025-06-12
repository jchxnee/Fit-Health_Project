import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TitleBar from '../components/TitleBar';
import { FaCamera, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import betaImg from '../assets/beta_user_img.png';

function ReviewCreationPage() {
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [user] = useState({ name: '김현아', img: betaImg });
  const [information] = useState({ coachName: '김성은', round: 2 });
  const contentTextareaRef = useRef(null); // textarea 참조
  const [isContentFocused, setIsContentFocused] = useState(false); // textarea 포커스 상태

  // 별점 관련 상태 (0.5점 단위 저장 가능)
  const [selectedRating, setSelectedRating] = useState(0); // 사용자가 최종 선택한 별점
  const [hoverRating, setHoverRating] = useState(0); // 마우스 오버 시 표시될 별점 (0.5점 단위)
  const starRatingRef = useRef(null); // 별점 컨테이너 참조

  // 내용과 별점이 모두 입력되었는지 확인하는 함수
  const isFormValid = content.trim() !== '' && selectedRating > 0;

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = () => {
    setImageCount((prevCount) => Math.min(prevCount + 1, 15));
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      console.log('폼이 유효하지 않습니다. 내용과 별점을 모두 입력해주세요.');
      return;
    }

    console.log('회차 정보:', information);
    console.log('내용:', content);
    console.log('이미지 수:', imageCount);
    console.log('선택된 별점:', selectedRating);
    // 실제 등록 로직 추가
    alert('리뷰가 성공적으로 등록되었습니다! (콘솔 확인)');
    // 성공 후 상태 초기화 (선택 사항)
    setContent('');
    setImageCount(0);
    setSelectedRating(0);
    setHoverRating(0);
    setIsContentFocused(false);
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
    const x = e.clientX - left; // 별점 컨테이너 내 마우스 상대 X 좌표
    const starWidth = width / 5; // 별 1개당 너비 (5개 별 기준)

    // 마우스 X 좌표에 따라 0.5점 단위로 계산
    let calculatedRating = 0;
    for (let i = 0; i < 5; i++) {
      const starStart = i * starWidth;
      const starEnd = (i + 1) * starWidth;

      if (x >= starStart && x < starEnd) {
        // 현재 별 내부에서의 상대 위치 (0 ~ starWidth)
        const relativeX = x - starStart;
        if (relativeX <= starWidth / 2) {
          calculatedRating = i + 0.5; // 별의 왼쪽 절반
        } else {
          calculatedRating = i + 1; // 별의 오른쪽 절반
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
    const x = e.clientX - left; // 별점 컨테이너 내 마우스 상대 X 좌표
    const starWidth = width / 5; // 별 1개당 너비 (5개 별 기준)

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
    return ''; // 유효하면 툴팁 없음
  };

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="리뷰 등록" />
        <ContentWrapper>
          <TopSection>
            <CategorySelect>
              {information.coachName} 트레이너 {information.round}회차
            </CategorySelect>
            {/* 별점 컨테이너를 SubmitButtonWrapper 바로 왼쪽에 배치 */}
            <StarRatingContainer
              ref={starRatingRef}
              onMouseMove={handleStarMouseMove}
              onClick={handleStarClick}
              onMouseLeave={() => setHoverRating(0)} // 마우스가 벗어나면 hoverRating 초기화
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
      <Footer />
    </>
  );
}

export default ReviewCreationPage;

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
  margin-right: auto; /* 별점과 등록 버튼을 오른쪽으로 밀어냅니다. */
`;

const StarRatingContainer = styled.div`
  display: flex;
  gap: 2px;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.star}; /* 테마의 star 색상 사용 */
  cursor: pointer;
  margin-left: auto; /* 등록 버튼과의 간격을 위해 auto margin 사용 */
  margin-right: ${({ theme }) => theme.spacing['3']}; /* 등록 버튼과의 오른쪽 마진 */
  /* 별점 컨테이너의 너비를 고정하여 마우스 이벤트 계산을 용이하게 함 (5개 별 아이콘 기준) */
  width: calc(${({ theme }) => theme.fontSizes.xl} * 5 + 8px); /* 5개 별 + 2px*4 gap */
`;

// 개별 별 아이콘 스타일 (이제 클릭/호버 이벤트는 부모 컨테이너에서 처리)
const StarIcon = styled.span`
  color: inherit; /* 부모인 StarRatingContainer의 색상을 상속받음 */
  /* 개별 별 아이콘의 마우스 이벤트를 제거하고, 부모에 위임 */
  pointer-events: none; /* 하위 요소에서 마우스 이벤트를 막아 부모가 이벤트를 받을 수 있도록 함 */
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
