import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { API_ENDPOINTS } from '../../api/config';
import api from '../../api/axios';
import { GoTriangleDown } from 'react-icons/go'; // GoTriangleDown 아이콘 추가

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-left: 12px;
`;

function NoticePostCreationPage({ isEditMode = false }) {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { id: noticeNoFromParams } = useParams();

  const noticeNo = isEditMode ? noticeNoFromParams : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('서비스'); // ⭐ 카테고리 상태 추가 (기본값 '서비스')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태
  const dropdownRef = useRef(null); // 드롭다운 외부 클릭 감지용 ref

  const categories = ['서비스', '이벤트']; // 공지사항 카테고리 목록

  useEffect(() => {
    if (isEditMode && noticeNo) {
      const fetchPostData = async () => {
        try {
          const response = await api.get(`${API_ENDPOINTS.NOTICE.DETAIL}/${noticeNo}`);
          const postData = response.data;
          setTitle(postData.notice_title);
          setContent(postData.notice_content);
          setSelectedCategory(postData.notice_category || '서비스'); // ⭐ 카테고리 데이터 로드
        } catch (error) {
          console.error('공지사항 데이터를 불러오는 데 실패했습니다:', error);
          alert('공지사항 데이터를 불러오는 데 실패했습니다.');
          navigate('/notice');
        }
      };
      fetchPostData();
    } else if (!isEditMode) {
      setTitle('');
      setContent('');
      setSelectedCategory('서비스'); // ⭐ 생성 모드일 때 카테고리 초기화
      setErrors({});
    }
  }, [isEditMode, noticeNo, navigate]);

  // 드롭다운 메뉴 외부 클릭 감지 (CommunityPostCreationPage와 동일)
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

  const isFormValid = title.trim() !== '' && content.trim() !== '';

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: null }));
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setErrors((prev) => ({ ...prev, content: null }));
  };

  const handleCategorySelect = (category) => {
    // ⭐ 카테고리 선택 핸들러 (드롭다운 아이템 클릭 시)
    setSelectedCategory(category);
    setIsDropdownOpen(false); // 선택 후 드롭다운 닫기
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
      alert('로그인 후에 공지사항을 작성/수정할 수 있습니다.');
      navigate('/login');
      return;
    }

    // 관리자(GRADE 'A')가 아니면 공지사항을 등록/수정할 수 없도록 추가
    if (user.grade !== 'A') {
      alert('공지사항은 관리자만 작성/수정할 수 있습니다.');
      navigate('/notice'); // 권한 없는 경우 공지사항 목록으로 돌려보냄
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    if (isEditMode && noticeNo) {
      formData.append('notice_no', noticeNo);
    }

    formData.append('user_email', user.email);
    formData.append('notice_title', title);
    formData.append('notice_content', content);
    formData.append('notice_category_name', selectedCategory); // ⭐ 카테고리 추가

    try {
      let response;
      if (isEditMode) {
        response = await api.put(`${API_ENDPOINTS.NOTICE.UPDATE}/${noticeNo}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('공지사항이 성공적으로 수정되었습니다!');
      } else {
        response = await api.post(API_ENDPOINTS.NOTICE.CREATE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('공지사항이 성공적으로 등록되었습니다!');
      }

      console.log('공지사항 처리 성공:', response.data);
      navigate('/notice');
    } catch (error) {
      console.error('공지사항 처리 실패:', error.response ? error.response.data : error.message);
      alert(`공지사항 처리 실패: ${error.response ? error.response.data || error.message : error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageContainer>
        <TitleBar title={isEditMode ? '공지사항 수정' : '공지사항 등록'} />
        <ContentWrapper onSubmit={handleSubmitClick}>
          <TopSection>
            {/* ⭐ 커뮤니티 페이지와 동일한 드롭다운 UI 적용 ⭐ */}
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
                {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : isEditMode ? '수정' : '등록'}
              </SubmitButton>
              {!isFormValid && <Tooltip>제목과 내용을 입력해주세요</Tooltip>}
            </SubmitButtonWrapper>
          </TopSection>

          <TitleInput
            id="title"
            type="text"
            placeholder="공지사항 제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
            $error={errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          <ContentTextareaContainer>
            {content === '' && (
              <OverlayPlaceholder>
                <p>공지사항 내용을 입력해주세요.</p>
                <p>예) 7월 정기 서버 점검 안내</p>
                <p>예) 새로운 기능 업데이트 소식</p>
                <div className="guidelines">
                  <p>※ 관리자만 공지사항을 등록/수정할 수 있습니다.</p>
                  <p>※ 중요하고 정확한 정보를 기입해주세요.</p>
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

export default NoticePostCreationPage;

// --- 스타일 컴포넌트 ---

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
  justify-content: space-between; /* 카테고리 셀렉트와 버튼을 양 끝으로 정렬 */
  align-items: center;
`;

// ⭐ CommunityPostCreationPage에서 복사해온 스타일 ⭐
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
