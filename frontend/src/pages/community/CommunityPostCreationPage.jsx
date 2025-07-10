import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import { FaCamera } from 'react-icons/fa';
import { GoTriangleDown } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { API_ENDPOINTS } from '../../api/config';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { getUploadUrl, uploadFileToS3 } from '../../api/file'; // S3 파일 업로드 관련 함수 import

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/'; // S3 CloudFront URL

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-left: 12px;
`;

function CommunityPostCreationPage({ isEditMode = false }) {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { id: boardNoFromParams } = useParams();

  const boardNo = isEditMode ? boardNoFromParams : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('운동해요!');
  const [files, setFiles] = useState([]); // 새로 업로드할 파일들 (File 객체)
  const [existingImageUrls, setExistingImageUrls] = useState([]); // 기존 이미지 정보 { file_no, url }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const imageCount = files.length + existingImageUrls.length; // 전체 이미지 수 (신규 + 기존)

  const categories = ['운동해요!', '궁금해요!', '소통해요!'];

  // 게시글 데이터 불러오기 (수정 모드일 경우)
  useEffect(() => {
    if (isEditMode && boardNo) {
      const fetchPostData = async () => {
        try {
          // 사용자 이메일을 쿼리 파라미터로 추가 (필요에 따라)
          const response = await api.get(`${API_ENDPOINTS.BOARD.DETAIL}/${boardNo}?userEmail=${user.email}`);
          const postData = response.data;
          setTitle(postData.board_title);
          setContent(postData.board_content);
          setSelectedCategory(postData.board_category_name);
          setExistingImageUrls(
            postData.files // 백엔드에서 files 정보를 배열로 준다고 가정
              ? postData.files.map((file) => ({
                  file_no: file.file_no,
                  url: `${CLOUDFRONT_URL}${file.change_name}`, // S3 CloudFront URL 사용
                  change_name: file.change_name, // 파일명도 저장하여 필요시 사용할 수 있도록
                }))
              : []
          );
        } catch (error) {
          console.error('게시글 데이터를 불러오는 데 실패했습니다:', error);
          toast.error('게시글 데이터를 불러오는 데 실패했습니다.');
          navigate('/community');
        }
      };
      fetchPostData();
    } else if (!isEditMode) {
      // 생성 모드일 때는 모든 상태를 초기화합니다.
      setTitle('');
      setContent('');
      setSelectedCategory('운동해요!');
      setFiles([]);
      setExistingImageUrls([]);
      setErrors({});
    }
  }, [isEditMode, boardNo, user.email, navigate]);

  // 폼 유효성 검사
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
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleImageUploadClick = () => {
    if (imageCount >= 15) {
      toast.error('이미지는 최대 15개까지 업로드할 수 있습니다.');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalCurrentImages = files.length + existingImageUrls.length;
    const filesToAdd = selectedFiles.slice(0, 15 - totalCurrentImages);

    if (filesToAdd.length < selectedFiles.length) {
      toast.error(
        `최대 15개의 이미지만 업로드할 수 있습니다. 현재 ${totalCurrentImages}개의 이미지가 있으며, ${filesToAdd.length}개의 새로운 이미지만 추가됩니다.`
      );
    }

    setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    e.target.value = null; // 동일 파일 재선택 가능하게 인풋 초기화
  };

  const handleRemoveExistingImage = (fileNoToRemove) => {
    setExistingImageUrls((prevUrls) => prevUrls.filter((file) => file.file_no !== fileNoToRemove));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();

    console.log('현재 user 객체:', user); // user 객체 전체 확인
    console.log('현재 user.email:', user.email); // user.email 값 확인
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
      toast.error('로그인 후에 게시글을 작성/수정할 수 있습니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const uploadedFileNames = []; // S3에 업로드된 파일의 새 이름을 저장할 배열

    try {
      // 1. 새로 추가된 파일들을 S3에 업로드
      for (const file of files) {
        try {
          // 'community/' 폴더에 업로드되도록 path를 설정
          const { presignedUrl, changeName } = await getUploadUrl(file.name, file.type, 'community/');
          await uploadFileToS3(presignedUrl, file);
          uploadedFileNames.push(changeName);
        } catch (uploadError) {
          console.error('S3 파일 업로드 실패:', uploadError);
          toast.error('이미지 업로드 중 문제가 발생했습니다. 다시 시도해주세요.');
          setIsSubmitting(false);
          return; // 업로드 실패 시 함수 종료
        }
      }

      // 2. formData에 게시글 데이터 및 파일 이름 추가
      if (isEditMode && boardNo) {
        formData.append('board_no', boardNo);
      }

      formData.append('user_email', user.email);
      formData.append('board_category_name', selectedCategory);
      formData.append('board_title', title);
      formData.append('board_content', content);

      // 수정 모드일 경우, 남아있는 기존 이미지의 file_no를 보냅니다.
      // 백엔드 API가 기존 파일 중 삭제되지 않은 파일의 file_no를 배열로 받도록 가정합니다.
      if (isEditMode && existingImageUrls.length > 0) {
        existingImageUrls.forEach((file) => {
          formData.append('existing_file_numbers', file.file_no);
        });
      }

      // S3에 업로드된 새로운 파일 이름들을 FormData에 추가
      // 백엔드 API가 'new_file_names'라는 파라미터 이름으로 파일명들을 받도록 가정합니다.
      uploadedFileNames.forEach((name) => {
        formData.append('new_file_names', name);
      });

      // 3. 백엔드 API 호출
      let response;
      if (isEditMode) {
        response = await api.put(`${API_ENDPOINTS.BOARD.UPDATE}/${boardNo}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // ⭐ 이 헤더를 명시적으로 추가
          },
        });
        toast.success('게시글이 성공적으로 수정되었습니다!');
      } else {
        response = await api.post(API_ENDPOINTS.BOARD.CREATE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // ⭐ 이 헤더를 명시적으로 추가
          },
        });
        toast.success('게시글이 성공적으로 등록되었습니다!');
      }
      console.log('게시글 처리 성공:', response.data);
      navigate('/community');
    } catch (error) {
      console.error('게시글 처리 실패:', error.response ? error.response.data : error.message);
      toast.error(`게시글 처리 실패: ${error.response ? error.response.data.message || error.message : error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 드롭다운 메뉴 외부 클릭 감지
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
        <TitleBar title={isEditMode ? '커뮤니티 글수정' : '커뮤니티 글등록'} />
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
                {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : isEditMode ? '수정' : '등록'}
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
            {/* 기존 이미지 미리보기 */}
            {existingImageUrls.map((file) => (
              <ImagePreviewContainer key={file.file_no}>
                <img
                  src={file.url}
                  alt={`기존 이미지`}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', margin: '2px', borderRadius: '6px' }}
                />
                <RemoveImageButton type="button" onClick={() => handleRemoveExistingImage(file.file_no)}>
                  X
                </RemoveImageButton>
              </ImagePreviewContainer>
            ))}
            {/* 새로 추가된 이미지 미리보기 */}
            {files.map((file, index) => (
              <ImagePreviewContainer key={`new-${index}`}>
                <img
                  src={URL.createObjectURL(file)} // 새 파일은 URL.createObjectURL로 미리보기
                  alt={`preview-${index}`}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', margin: '2px', borderRadius: '6px' }}
                />
                <RemoveImageButton type="button" onClick={() => handleRemoveNewImage(index)}>
                  X
                </RemoveImageButton>
              </ImagePreviewContainer>
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

// --- 추가된 스타일 컴포넌트 ---
const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
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

// --- 기존 스타일 컴포넌트 (변경 없음) ---
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
