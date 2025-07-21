import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CiCamera } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import basicProfile from '../../../public/img/basicProfile.jpg';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { memberService } from '../../api/member';
import { BeatLoader } from 'react-spinners';
import { getUploadUrl, uploadFileToS3 } from '../../api/file';
const { VITE_KAKAO_URL, VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URL } = import.meta.env;
const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

// 이름 전용 yup 스키마
const nameSchema = yup.object({
  username: yup
    .string()
    .required('이름을 입력하세요')
    .min(2, '사용자 이름은 2자 이상 입력해주세요.')
    .max(20, '사용자 이름은 20자 이하 입력해주세요.')
    .test('is-different', '변경할 정보를 입력해주세요', function (value) {
      const { original } = this.options.context || {};
      return value !== original;
    }),
});

// 생년월일 전용 yup 스키마
const birthSchema = yup.object({
  birth: yup
    .date()
    .required('생일을 입력하세요')
    .max(new Date(), '미래 날짜는 선택할 수 없습니다.')
    .test('is-different', '변경할 정보를 입력해주세요', function (value) {
      const { original } = this.options.context || {};
      return value !== original;
    }),
});

function AccountSettingsPage() {
  const { user, updateUser } = useUserStore();
  const [imageUrl, setImageUrl] = useState(user.img ? `${CLOUDFRONT_URL}${user.img}?v=${Date.now()}` : basicProfile);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    // e.target.files가 배열인지, 길이가 1 이상인지 확인
    if (!e.target?.files || e.target.files.length === 0) {
      console.warn('파일이 선택되지 않았습니다.');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // 이미지 미리보기
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    setIsLoading(true);
    try {
      const { presignedUrl, changeName } = await getUploadUrl(file.name, file.type, 'profile/');
      await uploadFileToS3(presignedUrl, file);
      const response = await memberService.updateProfileImage(changeName);
      console.log('응답 확인:', response);

      toast.success('이미지 변경 완료!');
      updateUser({ img: changeName });
      setImageUrl(`${CLOUDFRONT_URL}${changeName}?v=${Date.now()}`);
    } catch (error) {
      toast.error('이미지 변경 중 문제가 발생했습니다.');
      console.error('이미지 업로드 실패', error);
      setImageUrl(user.img || basicProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user.name,
      birth: user.birth,
    },
  });

  const handleNameEdit = async () => {
    try {
      setIsLoading(true);
      await nameSchema.validate({ username: getValues('username') }, { context: { original: user.name } });

      await memberService.updateName(getValues('username'));

      toast.success('이름 변경 완료!');
      updateUser({ name: getValues('username') });
      clearErrors('username');
    } catch (err) {
      // yup ValidationError인지 확인 (그렇지 않으면 네트워크 에러 등)
      if (err.name === 'ValidationError') {
        setError('username', { type: 'manual', message: err.message });
        toast.error(err.message);
      } else {
        toast.error('이름 변경 중 문제가 발생했습니다.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBirthEdit = async () => {
    try {
      setIsLoading(true);
      // 기존 생일과 비교해서 변경 없으면 에러 뜨게 하려면 context 전달
      await birthSchema.validate({ birth: getValues('birth') }, { context: { original: user.birth } });

      // 예: 서버에 생일 변경 요청 (memberService.updateBirth 등)
      await memberService.updateBirth(getValues('birth'));

      toast.success('생년월일 변경 완료!');
      updateUser({ birth: getValues('birth') });
      clearErrors('birth');
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError('birth', { type: 'manual', message: err.message });
        toast.error(err.message);
      } else {
        toast.error('생년월일 변경 중 문제가 발생했습니다.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();

    if (user.socialType !== null && user.socialType !== undefined) {
      const confirmed = window.confirm(
        '소셜 로그인 회원은 로그인 인증을 다시 받아야 합니다. 로그인 페이지로 이동하시겠습니까?'
      );
      if (confirmed) {
        SocialDelete();
      }
    } else {
      // socialType이 null이면 일반 회원 탈퇴 페이지로 이동
      window.location.href = '/deleteMemberPage';
    }
  };

  const SocialDelete = () => {
    sessionStorage.setItem('action', 'delete');

    if (user.socialType === 'GOOGLE') {
      window.location.href = 'https://fit-health.store/oauth2/authorization/google';
    } else if (user.socialType === 'KAKAO') {
      window.location.href = 'https://fit-health.store/oauth2/authorization/kakao';
    } else if (user.socialType === 'NAVER') {
      window.location.href = 'https://fit-health.store/authorization/naver';
    } else {
      alert('소셜 로그인 정보가 없습니다.');
    }
  };

  return (
    <>
      <SettingsContainer>
        <SettingsForm>
          <PageTitle>계정 설정</PageTitle>

          <ProfileImageWrapper onClick={handleImageClick}>
            <HiddenInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <ProfileImage src={imageUrl ? imageUrl : basicProfile} alt="프로필 이미지" />
            <CameraIcon>
              <StyledCameraIcon />
            </CameraIcon>
          </ProfileImageWrapper>

          {/* 이메일 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>이메일</Label>
            </LabelWrapper>
            <DisplayText>{user.email}</DisplayText>
          </InputGroup>

          {/* 이름 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>이름</Label>
              <ActionLink onClick={handleNameEdit} disabled={isLoading}>
                수정
              </ActionLink>
            </LabelWrapper>
            <DisplayInput type="text" {...register('username')} />
          </InputGroup>

          {/* 생년월일 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>생년월일</Label>
              <ActionLink onClick={handleBirthEdit} disabled={isLoading}>
                수정
              </ActionLink>
            </LabelWrapper>
            <DisplayInput type="date" {...register('birth')} />
          </InputGroup>

          <ButtonGroup>
            <SettingsButton to="/myInfoPage">내 정보 관리</SettingsButton>
            <SettingsButton
              to="/changePwdPage"
              disabled={user.socialType !== null && user.socialType !== undefined}
              style={{
                pointerEvents: user.socialType !== null && user.socialType !== undefined ? 'none' : 'auto',
                opacity: user.socialType !== null && user.socialType !== undefined ? 0.8 : 1,
              }}
            >
              비밀번호 변경
            </SettingsButton>
            <SettingsButton to="/deleteMemberPage" onClick={handleDeleteClick}>
              회원 탈퇴
            </SettingsButton>
          </ButtonGroup>
        </SettingsForm>
      </SettingsContainer>
    </>
  );
}

export default AccountSettingsPage;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['20']};
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  width: 100%;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SettingsForm = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['10']};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
  text-align: center;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  justify-content: center;
  align-items: center;
  /* overflow: hidden; /* <-- 이 부분을 유지하여 프로필 이미지가 원형으로 잘리도록 합니다. */
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const HiddenInput = styled.input`
  display: none;
`;

const CameraIcon = styled.div`
  position: absolute;
  /* 아이콘이 잘리지 않도록 위치를 살짝 안쪽으로 조정 */
  bottom: ${({ theme }) => theme.spacing['1']}; /* 예를 들어, 4px 안쪽으로 */
  right: ${({ theme }) => theme.spacing['1']}; /* 예를 들어, 4px 안쪽으로 */

  background-color: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing['1']};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 10;
`;

export const StyledCameraIcon = styled(CiCamera)`
  width: 16px;
  height: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column; /* 자식 요소들을 수직으로 배치 */
  margin-bottom: ${({ theme }) => theme.spacing['6']}; /* 간격 조정 */
  width: 100%;
  max-width: 380px;
  text-align: left; /* 내부 텍스트 정렬 */
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* 라벨과 수정 링크를 양 끝으로 정렬 */
  align-items: flex-end; /* 라벨과 수정 링크의 기준선을 하단으로 맞춤 */
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 라벨과 입력창 사이 간격 */
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
`;

const DisplayText = styled.span`
  flex-grow: 1; /* 남은 공간을 채우도록 함 */
  padding: ${({ theme }) => theme.spacing['2']} 0; /* 상하 패딩, 좌우 0 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  width: 100%; /* 너비 100% */
  text-align: left;
`;

const DisplayInput = styled.input`
  flex-grow: 1; /* 남은 공간을 채우도록 함 */
  padding: ${({ theme }) => theme.spacing['2']} 0; /* 상하 패딩, 좌우 0 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  width: 100%; /* 너비 100% */
  text-align: left;
`;

const ActionLink = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  /* margin-left는 LabelWrapper에서 space-between으로 대체되므로 제거 */
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-top: ${({ theme }) => theme.spacing['8']};
  width: 100%;
  max-width: 380px;
`;

const SettingsButton = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[32]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => (theme.fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  width: 380px;
  background-color: ${({ theme }) => theme.colors.white}; /* white 색상 사용 */
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']}; /* gray[300] 색상 사용 */
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]}; /* gray[100] 색상 사용 */
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.gray[100]}; /* gray[200] 색상 사용 */
  }

  outline: none;
`;
