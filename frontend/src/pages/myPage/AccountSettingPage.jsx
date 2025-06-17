import { useState } from 'react';
import styled from 'styled-components';
import { CiCamera } from 'react-icons/ci';
import ButtonStyle from '../../styles/common/Button';
import Header from '../../components/Header';
import betaImg from '../../assets/beta_user_img.png'; // 이미지 경로에 맞게 수정
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function AccountSettingsPage() {
  // Dummy data for user information
  const [userEmail] = useState('user01@naver.com'); // Example name
  const [userName, setUserName] = useState('김민수'); // Example name
  const [userBirthdate, setUserBirthdate] = useState('1990-05-15'); // Example birthdate
  const [profileImgSrc, setProfileImgSrc] = useState('https://via.placeholder.com/100'); // Placeholder image

  const [user] = useState({ name: '김현아', img: betaImg });
  // Functions to handle "수정" clicks (these would open modals or navigate)
  const handleNameEdit = () => {
    alert('이름 수정 기능');
    // 여기에 이름 수정 모달 또는 페이지 전환 로직 추가
  };

  const handleBirthdateEdit = () => {
    alert('생년월일 수정 기능');
    // 여기에 생년월일 수정 모달 또는 페이지 전환 로직 추가
  };

  const handleProfileImageChange = () => {
    alert('프로필 사진 변경 기능');
    // 여기에 프로필 사진 업로드/변경 로직 추가
  };

  const handlePersonalDataManagement = () => {
    alert('개인 정보 관리 페이지로 이동');
    // Navigate to personal data management page
  };

  const handleCustomDataManagement = () => {
    alert('맞춤 정보 관리 페이지로 이동');
    // Navigate to custom data management page
  };

  const handleWithdrawal = () => {
    alert('회원 탈퇴 처리');
    // Trigger user withdrawal process
  };

  return (
    <>
      <Header user={user} />
      <SettingsContainer>
        <SettingsForm>
          <PageTitle>계정 설정</PageTitle>

          <ProfileImageWrapper onClick={handleProfileImageChange}>
            <ProfileImage src={profileImgSrc} alt="프로필 이미지" />
            <CameraIcon>
              <StyledCameraIcon />
            </CameraIcon>
          </ProfileImageWrapper>

          {/* 이름 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>이메일</Label>
            </LabelWrapper>
            <DisplayText>{userEmail}</DisplayText>
          </InputGroup>

          {/* 이름 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>이름</Label>
              <ActionLink onClick={handleNameEdit}>수정</ActionLink>
            </LabelWrapper>
            <DisplayText>{userName}</DisplayText>
          </InputGroup>

          {/* 생년월일 InputGroup */}
          <InputGroup>
            <LabelWrapper>
              <Label>생년월일</Label>
              <ActionLink onClick={handleBirthdateEdit}>수정</ActionLink>
            </LabelWrapper>
            <DisplayText>{userBirthdate}</DisplayText>
          </InputGroup>

          <ButtonGroup>
            <SettingsButton to="/myInfoPage">내 정보 관리</SettingsButton>
            <SettingsButton to="/changePwdPage">비밀번호 변경</SettingsButton>
            <SettingsButton to="/deleteMemberPage">회원 탈퇴</SettingsButton>
          </ButtonGroup>
        </SettingsForm>
      </SettingsContainer>
      <Footer />
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
