import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaCamera, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import api from '../../api/axios.js';
import { API_ENDPOINTS } from '../../api/config.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // toast 메시지를 위한 임포트 추가

// ===========================================
// 스타일 컴포넌트 정의
// ===========================================

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
  width: calc(${({ theme }) => theme.fontSizes.xl} * 5 + 8px); /* 별 5개와 간격에 맞춘 너비 */
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
  border: none; /* 기본 textarea border 제거 */

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

// 이미지 미리보기 및 제거 버튼 관련 스타일
const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 4px; /* 이미지 간격 조정 */
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  z-index: 10;
`;

function ReviewCreationPage() {
  const location = useLocation();
  const { paymentId, trainerName, trainerNo } = location.state || {};
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [file, setFile] = useState(null); // 단일 파일 저장을 위한 상태

  // imageCount를 파일이 존재하는지에 따라 0 또는 1로 설정
  const imageCount = file ? 1 : 0;

  const [information, setInformation] = useState({
    coachName: trainerName || '알 수 없음',
    paymentId: paymentId,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (paymentId && trainerName) {
      setInformation({ coachName: trainerName, paymentId: paymentId });
    } else {
      console.warn('ReviewCreationPage: paymentId or trainerName not found in location state.');
    }
  }, [paymentId, trainerName]);

  const contentTextareaRef = useRef(null);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const starRatingRef = useRef(null);

  const isFormValid = content.trim() !== '' && selectedRating > 0 && information.paymentId != null;

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUploadClick = () => {
    if (file) {
      toast.info('이미지 1개만 업로드할 수 있습니다. 기존 이미지를 먼저 제거해주세요.');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    e.target.value = null;
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      console.log('폼이 유효하지 않습니다. 내용, 별점, Payment ID를 모두 확인해주세요.');
      toast.error('리뷰 내용을 입력하고 별점을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('paymentId', information.paymentId);
    formData.append('reviewContent', content);
    formData.append('rating', selectedRating);
    formData.append('heart', 0);

    if (file) {
      formData.append('reviewImageFile', file);
    }

    console.log('전송할 리뷰 데이터 (FormData):', Object.fromEntries(formData.entries()));

    try {
      const response = await api.post(API_ENDPOINTS.REVIEW.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('리뷰 등록 성공:', response.data);
      toast.success('리뷰가 성공적으로 등록되었습니다!');
      navigate(`/coachReview/${trainerNo}`);

      setContent('');
      setFile(null);
      setSelectedRating(0);
      setHoverRating(0);
      setIsContentFocused(false);
    } catch (error) {
      console.error('리뷰 등록 실패:', error.response ? error.response.data : error.message);
      toast.error(`리뷰 등록 실패: ${error.response?.data?.message || error.message}`);
    }
  };

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
            <UploadButton onClick={handleImageUploadClick}>
              <FaCamera size={20} />
            </UploadButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <ImageCount>{imageCount}/1</ImageCount> {/* 1개 제한으로 변경 */}
            {file /* 파일이 있을 때만 미리보기 표시 */ && (
              <ImagePreviewContainer>
                <img
                  src={URL.createObjectURL(file)}
                  alt="미리보기 이미지"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', margin: '2px', borderRadius: '6px' }}
                />
                <RemoveImageButton type="button" onClick={handleRemoveFile}>
                  X
                </RemoveImageButton>
              </ImagePreviewContainer>
            )}
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
                  <p>※ 리뷰 삭제 시 재작성 불가하니 신중히 작성 부탁드립니다.</p>
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
