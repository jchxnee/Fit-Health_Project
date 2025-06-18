import React, { useState, useRef, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaCamera } from 'react-icons/fa';
import { GoTriangleDown } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
// import { useCreateForm } from '../hooks/useCreateForm'; // 이 훅을 사용한다고 가정합니다.
import axios from 'axios'; // axios 임포트

// --- styled-components 및 기타 컴포넌트 임포트 (기존 코드와 동일) ---
// ErrorMessage 컴포넌트가 없다면 추가해주세요.
const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-left: 12px;
`;

function CommunityPostCreationPage() {
  // useCreateForm 훅을 사용한다고 가정하고 코드를 작성합니다.
  // 이 훅은 register, handleSubmit, formState: { errors, isSubmitting, isValid }, setValue, watch를 반환합니다.
  // 만약 useCreateForm을 사용하지 않고 있다면, 아래 useState와 핸들러들을 직접 사용해야 합니다.
  // 편의상 useCreateForm이 있다고 가정하고 설명합니다.
  // const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, setValue, watch } = useCreateForm();
  // useCreateForm 훅이 없으므로 임시로 useState로 대체합니다. 실제 프로젝트에서는 react-hook-form 사용을 권장합니다.
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
    fileInputRef.current.click(); // 숨겨진 파일 인풋 클릭
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newTotalFiles = [...files, ...selectedFiles].slice(0, 15); // 기존 파일과 합치고 최대 15개 유지
    setFiles(newTotalFiles);
    // 파일 입력 필드 초기화 (동일 파일 재선택 시 onChange 이벤트 발생시키기 위함)
    e.target.value = null;
  };

  // 등록 버튼 클릭 핸들러
  // 이 함수가 form의 onSubmit 이벤트에 직접 연결될 것입니다.
  const handleSubmitClick = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    // 수동 유효성 검사 (useCreateForm 훅을 사용하지 않을 경우)
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

    setIsSubmitting(true); // 제출 중 상태로 설정

    // FormData 객체 생성
    const formData = new FormData();

    // 텍스트 데이터 추가
    // TODO: 'userEmail'은 실제 로그인된 사용자 정보를 기반으로 백엔드에서 가져오거나,
    // 클라이언트에서 보안적으로 안전한 방법으로 전달해야 합니다 (예: JWT 디코딩).
    // 여기서는 예시로 하드코딩합니다.
    formData.append('userEmail', 'loggedInUser@example.com');
    formData.append('boardCategoryName', selectedCategory);
    formData.append('boardTitle', title);
    formData.append('boardContent', content);

    // 파일 데이터 추가
    files.forEach((file) => {
      formData.append('files', file); // 'files'는 백엔드에서 MultipartFile 리스트를 받을 때 사용하는 파라미터 이름입니다.
    });

    try {
      // axios를 사용하여 POST 요청 보내기
      const response = await axios.post('/api/community/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 중요: 파일 업로드 시 이 헤더 필수
          // 인증 토큰이 있다면 여기에 추가: 'Authorization': `Bearer ${yourAuthToken}`
        },
      });

      console.log('게시글 등록 성공:', response.data);
      alert('게시글이 성공적으로 등록되었습니다!');
      navigate('/community'); // 성공 시 커뮤니티 목록 페이지로 이동
    } catch (error) {
      console.error('게시글 등록 실패:', error.response ? error.response.data : error.message);
      // 서버에서 보낸 에러 메시지를 사용자에게 보여줄 수 있습니다.
      alert(`게시글 등록에 실패했습니다: ${error.response ? error.response.data || error.message : error.message}`);
    } finally {
      setIsSubmitting(false); // 제출 완료 후 상태 변경
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
        {/* form 태그에 onSubmit 핸들러 연결 */}
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
              {/* type="submit"으로 변경하고 disabled 상태 관리 */}
              <SubmitButton type="submit" disabled={!isFormValid || isSubmitting} $isValid={isFormValid}>
                {isSubmitting ? '등록 중...' : '등록'}
              </SubmitButton>
              {!isFormValid && <Tooltip>제목과 내용을 입력해주세요</Tooltip>}
            </SubmitButtonWrapper>
          </TopSection>
          <UploadSection>
            <UploadButton type="button" onClick={handleImageUploadClick}>
              {' '}
              {/* type="button" 추가 */}
              <FaCamera size={20} />
            </UploadButton>
            {/* 실제 파일 인풋 (숨김) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple // 여러 파일 선택 가능
              accept="image/*" // 이미지 파일만 허용
              style={{ display: 'none' }}
            />
            <ImageCount>{imageCount}/15</ImageCount>
          </UploadSection>
          <TitleInput
            id="title"
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
            $error={errors.title} // 에러가 있을 때 스타일링을 위한 prop
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>} {/* 에러 메시지 표시 */}
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
            <ContentTextarea
              id="content"
              value={content}
              onChange={handleContentChange}
              $error={errors.content} // 에러가 있을 때 스타일링을 위한 prop
            />
          </ContentTextareaContainer>
          {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>} {/* 에러 메시지 표시 */}
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default CommunityPostCreationPage;

// --- 스타일 컴포넌트 ---
// 기존 스타일 컴포넌트들은 변동 없음
// SubmitButton에 `type="submit"`을 추가했으므로 `SubmitTextButton`을 `SubmitButton`으로 변경
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

// TitleInput, ContentTextarea에 $error prop을 받도록 수정
const TitleInput = styled.input`
  width: 100%;
  outline: none;
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray['800']};
  border-color: ${({ $error, theme }) => ($error ? 'red' : theme.colors.gray['300'])}; /* 에러 시 빨간색 테두리 */

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

// 기존의 나머지 스타일 컴포넌트들은 동일하게 유지됩니다.
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
