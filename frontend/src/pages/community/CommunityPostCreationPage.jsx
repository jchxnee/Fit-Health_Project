import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
import { FaCamera } from 'react-icons/fa';
import betaImg from '../../assets/beta_user_img.png';
import { GoTriangleDown } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트 추가

function CommunityPostCreationPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [user] = useState({ name: '김현아', img: betaImg });
  const contentTextareaRef = useRef(null);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('운동해요!'); // 기본 카테고리 (수정: '함께해요!' -> '운동해요!'로 변경, 제공된 categories 배열에 맞춰 통일)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 카테고리 배열은 '운동해요!', '궁금해요!', '소통해요!'로 통일 (기존과 동일)
  const categories = ['운동해요!', '궁금해요!', '소통해요!'];

  const isFormValid = title.trim() !== '' && content.trim() !== '';

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = () => {
    setImageCount((prevCount) => Math.min(prevCount + 1, 15));
  };

  // 등록 버튼 클릭 핸들러 수정
  const handleSubmitClick = (e) => {
    e.preventDefault(); // Link의 기본 동작(페이지 이동) 방지
    if (isFormValid) {
      console.log('선택된 카테고리:', selectedCategory);
      console.log('제목:', title);
      console.log('내용:', content);
      console.log('이미지 수:', imageCount);
      // 실제 등록 로직 추가 (API 호출 등)

      // 등록 성공 후 페이지 이동
      navigate('/community');
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="커뮤니티 글등록" />
        <ContentWrapper>
          <TopSection>
            <CategorySelect ref={dropdownRef}>
              <CategoryButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {selectedCategory}
                <GoTriangleDown size={26} />
              </CategoryButton>
              {isDropdownOpen && (
                <CategoryDropdown>
                  {categories.map((category) => (
                    <DropdownItem key={category} onClick={() => handleCategorySelect(category)}>
                      {category}
                    </DropdownItem>
                  ))}
                </CategoryDropdown>
              )}
            </CategorySelect>
            <SubmitButtonWrapper>
              {/* Link를 유지하되, onClick으로 페이지 이동을 제어 */}
              <SubmitTextButton
                to="/community"
                onClick={handleSubmitClick} // 클릭 핸들러 변경
                $isValid={isFormValid}
                // disabled prop은 Link에 직접적으로 작동하지 않으므로 제거하거나 스타일용으로만 사용
                // 여기서는 $isValid prop을 통해 스타일만 제어하고 실제 disabled는 onClick 로직으로 처리
              >
                등록
              </SubmitTextButton>
              {!isFormValid && <Tooltip>제목과 내용을 입력해주세요</Tooltip>}
            </SubmitButtonWrapper>
          </TopSection>

          <UploadSection>
            <UploadButton onClick={handleImageUpload}>
              <FaCamera size={20} />
            </UploadButton>
            <ImageCount>{imageCount}/15</ImageCount>
          </UploadSection>
          <TitleInput type="text" placeholder="제목을 입력해주세요." value={title} onChange={handleTitleChange} />
          <ContentTextareaContainer>
            {content === '' && !isContentFocused && (
              <OverlayPlaceholder>
                <p>궁금했던 모든 것을 물어보세요.</p>
                <p>예) 이런 키트는 어떻게 사용하는 건가요?</p>
                <p>예) 운동을 하다 무릎이 아팠어요ㅠㅠ 원인이 궁금해요</p>
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

export default CommunityPostCreationPage;

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
`;

const CategorySelect = styled.div`
  position: relative;
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const CategoryButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing['2']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray['700']};
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const CategoryDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  list-style: none;
  padding: ${({ theme }) => theme.spacing['2']} 0;
  margin-top: ${({ theme }) => theme.spacing['1']};
  z-index: 10;
  min-width: 120px;
`;

const DropdownItem = styled.li`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray['800']};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;

const SubmitButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

// Link 기반 SubmitTextButton은 유지하되, 클릭 핸들러에서 이동 제어
const SubmitTextButton = styled(Link)`
  background: none;
  border: none;
  color: ${({ $isValid, theme }) => ($isValid ? theme.colors.primary : theme.colors.gray['400'])};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  /* Link 컴포트에 disabled prop은 직접적으로 작동하지 않으므로 cursor 스타일로만 제어 */
  cursor: ${({ $isValid }) => ($isValid ? 'pointer' : 'not-allowed')};
  outline: none;
  transition: color 0.2s ease-in-out;
  text-decoration: none; /* Link의 기본 밑줄 제거 */

  &:hover {
    /* $isValid 상태에 따라 hover 스타일 적용 */
    text-decoration: ${({ $isValid }) => ($isValid ? 'underline' : 'none')};
    color: ${({ $isValid, theme }) => ($isValid ? theme.colors.primaryDark : theme.colors.gray['400'])};
  }

  /* disabled 상태와 유사한 시각적 효과를 위해 opacity만 적용 (실제 클릭 방지는 onClick 로직에서) */
  opacity: ${({ $isValid }) => ($isValid ? 1 : 0.6)};
  pointer-events: ${({ $isValid }) => ($isValid ? 'auto' : 'none')}; /* 비활성화 시 마우스 이벤트 방지 */
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

  /* 화살표 */
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

const TitleInput = styled.input`
  width: 100%;
  outline: none;
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray['800']};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['500']};
  }
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
