import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaCamera } from 'react-icons/fa';
import { GoTriangleDown } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore'; // useUserStore 임포트
import { API_ENDPOINTS } from '../../api/config';
import api from '../../api/axios';

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-left: 12px;
`;

function CommunityPostCreationPage() {
  const { user } = useUserStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('운동해요!');
  const [files, setFiles] = useState([]); // 업로드할 파일들을 저장하는 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태
  const [errors, setErrors] = useState({}); // 에러 상태 (간단한 수동 유효성 검사)

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null); // 파일 인풋 참조

  const imageCount = files.length; // 이미지 수

  const categories = ['운동해요!', '궁금해요!', '소통해요!'];

  // 폼 유효성 검사 (간단한 예시)
  const isFormValid = title.trim() !== '' && content.trim() !== '';

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: null })); // 입력 시 에러 제거
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setErrors((prev) => ({ ...prev, content: null })); // 입력 시 에러 제거
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleImageUploadClick = () => {
    if (imageCount >= 15) {
      alert('이미지는 최대 15개까지 업로드할 수 있습니다.');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles].slice(0, 15);
    setFiles(newFiles);
    e.target.value = null;
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (title.trim() === '') {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (content.trim() === '') {
      newErrors.content = '내용을 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user || !user.email) {
      alert('로그인 후에 게시글을 작성할 수 있습니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    formData.append('user_email', user.email);
    formData.append('board_category_name', selectedCategory);
    formData.append('board_title', title);
    formData.append('board_content', content);

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await api.post(API_ENDPOINTS.BOARD.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('게시글 등록 성공:', response.data);
      alert('게시글이 성공적으로 등록되었습니다!');
      navigate('/community');
    } catch (error) {
      console.error('게시글 등록 실패:', error.response ? error.response.data : error.message);
      alert(`게시글 등록에 실패했습니다: ${error.response ? error.response.data || error.message : error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
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
        <TitleBar title="커뮤니티 글등록" />
        <ContentWrapper onSubmit={handleSubmitClick}>
          <TopSection>
            <CategorySelect ref={dropdownRef}>
              <CategoryButton type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
              <SubmitButton type="submit" disabled={!isFormValid || isSubmitting} $isValid={isFormValid}>
                {isSubmitting ? '등록 중...' : '등록'}
              </SubmitButton>
              {!isFormValid && <Tooltip>제목과 내용을 입력해주세요</Tooltip>}
            </SubmitButtonWrapper>
          </TopSection>
          <UploadSection>
            <UploadButton type="button" onClick={handleImageUploadClick}>
              <FaCamera size={20} />
            </UploadButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />
            <ImageCount>{imageCount}/15</ImageCount>
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{ width: '60px', height: '60px', objectFit: 'cover', margin: '2px', borderRadius: '6px' }}
              />
            ))}
          </UploadSection>
          <TitleInput
            id="title"
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
            $error={errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          <ContentTextareaContainer>
            {content === '' && (
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
            <ContentTextarea id="content" value={content} onChange={handleContentChange} $error={errors.content} />
          </ContentTextareaContainer>
          {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default CommunityPostCreationPage;

// --- 스타일 컴포넌트 (변경 없음) ---
const SubmitButton = styled.button`
  background: none;
  border: none;
  color: ${({ $isValid, theme }) => ($isValid ? theme.colors.primary : theme.colors.gray['400'])};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: ${({ $isValid }) => ($isValid ? 'pointer' : 'not-allowed')};
  outline: none;
  transition: color 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    text-decoration: ${({ $isValid }) => ($isValid ? 'underline' : 'none')};
    color: ${({ $isValid, theme }) => ($isValid ? theme.colors.primaryDark : theme.colors.gray['400'])};
  }

  opacity: ${({ $isValid }) => ($isValid ? 1 : 0.6)};
`;

const TitleInput = styled.input`
  width: 100%;
  outline: none;
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray['800']};
  border-color: ${({ $error, theme }) => ($error ? 'red' : theme.colors.gray['300'])};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['500']};
  }
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

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.form`
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: 20px;
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

  .guidelines {
    margin-top: ${({ theme }) => theme.spacing['4']};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.gray['500']};

    p {
      margin: 0;
    }
  }
`;
