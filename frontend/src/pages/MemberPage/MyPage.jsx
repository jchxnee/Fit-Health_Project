import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import kakaotalkIcon from '/public/img/kakaotalk.png';
import googleIcon from '/public/img/google.png';
import naverIcon from '/public/img/naver.png';
import { FaBell } from 'react-icons/fa';
import { LuClipboardList } from 'react-icons/lu';
import { AiOutlineTool } from 'react-icons/ai';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import ButtonStyle from '../../styles/common/Button';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import basicProfile from '../../../public/img/basicProfile.jpg';
import emailIcon from '../../../public/img/email.png';
import { useHealthForm } from '../../hooks/member/useHealthForm';
import { healthService } from '../../api/health';
import { toast } from 'react-toastify';
import HealthChart from '../../components/HealthChart';
import api from '../../api/axios';

const MyPage = () => {
  const { user } = useUserStore();

  const [rawHealthData, setRawHealthData] = useState([]);
  const [isHealthInputModalOpen, setIsHealthInputModalOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // 읽지 않은 알림 개수 가져오기
  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user || !user.email) {
      setUnreadNotificationCount(0);
      return;
    }
    try {
      const response = await api.get('/api/notifications/unread/count'); // 여기에 인증 포함된 axios 인스턴스를 쓰는 것이 좋음
      setUnreadNotificationCount(response.data.count);
    } catch (error) {
      console.error('읽지 않은 알림 개수를 가져오는 데 실패했습니다:', error);
    }
  }, [user]);

  useEffect(() => {
    let intervalId;
    if (user && user.email) {
      fetchUnreadNotificationCount();
      intervalId = setInterval(fetchUnreadNotificationCount, 30000); // 30초마다 폴링
    } else {
      setUnreadNotificationCount(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, fetchUnreadNotificationCount]);

  // 건강 정보 입력 폼 Hook
  const { register, handleSubmit, onSubmit, errors, isLoading, reset } = useHealthForm({
    useremail: user.email,
    onSuccess: async () => {
      try {
        const freshData = await healthService.getHealthData(user.email);
        setRawHealthData(freshData);
      } catch (err) {
        toast.error('차트 데이터 업데이트에 실패했습니다.');
        console.error(err);
      } finally {
        closeHealthInputModal();
      }
    },
  });

  // 페이지 로딩 시 차트 데이터 불러오기
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const raw = await healthService.getHealthData(user.email);
        setRawHealthData(raw);
      } catch (err) {
        console.error('건강 정보 조회 실패', err);
      }
    };

    fetchHealthData();
  }, [user.email]);

  const openHealthInputModal = () => setIsHealthInputModalOpen(true);
  const closeHealthInputModal = () => {
    setIsHealthInputModalOpen(false);
    reset();
  };

  return (
    <>
      <PageContainer>
        <TitleBar title={'마이페이지'} />

        <ProfileSection>
          <ProfileImage src={user.img ? user.img : basicProfile} alt="User Profile" />
          <ProfileInfo>
            <ProfileName>{user.name}님</ProfileName>
            <ProfileEmail>
              <ProfileIcon
                src={
                  user.socialType === 'NAVER'
                    ? naverIcon
                    : user.socialType === 'KAKAO'
                      ? kakaotalkIcon
                      : user.socialType === 'GOOGLE'
                        ? googleIcon
                        : emailIcon
                }
                alt="social"
                style={user.socialType === 'NAVER' ? { borderRadius: '50%' } : undefined}
              />
              {user.email}
            </ProfileEmail>
          </ProfileInfo>
          <SettingButton to="/accountSettingPage">계정 설정</SettingButton>
        </ProfileSection>

        <AlertBar>
          <StyledFaBell />
          {unreadNotificationCount > 0
            ? `읽지 않은 알림이 ${unreadNotificationCount}개 있습니다.`
            : '현재 읽지 않은 알림이 없습니다.'}
        </AlertBar>

        {/* 건강 정보 섹션 추가 */}
        {user.grade === 'U' && (
          <HealthInfoContainer>
            <HealthInfoSectionHeader>
              <SectionHeader>
                건강 정보
                <MdOutlineHealthAndSafety />
              </SectionHeader>
              <HealthInfoInputButton onClick={openHealthInputModal}>건강정보 입력</HealthInfoInputButton>
            </HealthInfoSectionHeader>
            <ChartContainer>
              <div style={{ height: '400px' }}>
                <HealthChart rawData={rawHealthData} isLoading={isLoading} />
              </div>
            </ChartContainer>
            <Divider />
          </HealthInfoContainer>
        )}

        <SectionBlock>
          <SectionHeader>
            내역
            <LuClipboardList />
          </SectionHeader>
          {user.grade === 'U' ? (
            <SectionLink to="/matchingList">신청 내역</SectionLink>
          ) : (
            <SectionLink to="/coachmatchingList">코칭 내역</SectionLink>
          )}
          <Divider />
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            관리
            <AiOutlineTool />
          </SectionHeader>
          {user.grade === 'C' && <SectionLink to={`/coachModify/${user.trainerNo}`}>핏코치 정보 수정</SectionLink>}
          <SectionLink to="/myPostsPage">내가 작성한 게시물/댓글</SectionLink>
          {user.grade === 'U' && (
            <SectionLink to="/myReviewsPage" state={{ userEmail: user.email }}>
              내가 작성한 리뷰
            </SectionLink>
          )}
          <Divider />
        </SectionBlock>

        {/* 건강 정보 입력 모달 */}
        {isHealthInputModalOpen && (
          <ModalOverlay onClick={closeHealthInputModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>건강 정보 입력</ModalTitle>
                <CloseButton onClick={closeHealthInputModal}>&times;</CloseButton>
              </ModalHeader>

              {/* react-hook-form으로 제출 */}
              <FormGroup onSubmit={handleSubmit(onSubmit)}>
                <InputContainer>
                  <InputLabel htmlFor="weight">몸무게 (kg)</InputLabel>
                  <InputField
                    type="number"
                    id="weight"
                    {...register('weight')}
                    $error={errors.weight}
                    placeholder="예: 70.5"
                    step="0.1"
                  />
                  {errors.weight && <ErrorMessage>{errors.weight.message}</ErrorMessage>}
                </InputContainer>

                <InputContainer>
                  <InputLabel htmlFor="bodyFat">체지방량 (kg)</InputLabel>
                  <InputField
                    type="number"
                    id="bodyFat"
                    {...register('bodyFat')}
                    $error={errors.bodyFat}
                    placeholder="예: 15.2"
                    step="0.1"
                  />
                  {errors.bodyFat && <ErrorMessage>{errors.bodyFat.message}</ErrorMessage>}
                </InputContainer>

                <InputContainer>
                  <InputLabel htmlFor="skeletalMuscle">골격근량 (kg)</InputLabel>
                  <InputField
                    type="number"
                    id="skeletalMuscle"
                    {...register('skeletalMuscle')}
                    $error={errors.skeletalMuscle}
                    placeholder="예: 30.1"
                    step="0.1"
                  />
                  {errors.skeletalMuscle && <ErrorMessage>{errors.skeletalMuscle.message}</ErrorMessage>}
                </InputContainer>

                {/* form 내부의 submit 버튼 */}
                <ModalSelectButton type="submit" disabled={isLoading}>
                  확인
                </ModalSelectButton>
              </FormGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default MyPage;

const PageContainer = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.6;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  a,
  button {
    outline: none;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  width: 100%;
  max-width: ${({ theme }) => theme.width.md};
  padding: ${({ theme }) => theme.spacing['5']} 0;
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing['3']};
    align-items: flex-start;
  }
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    width: 60px;
    height: 60px;
    margin-bottom: ${({ theme }) => theme.spacing['2']};
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spacing['0']};

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    align-items: center;
  }
`;

const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0;
  display: flex;
  align-items: center;
`;

const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['600']};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const ProfileIcon = styled.img`
  width: 16px; /* Adjust size as needed, 16px is common for inline icons */
  height: 16px;
  vertical-align: middle; /* Ensures it aligns nicely with text */
  flex-shrink: 0; /* Prevent it from shrinking */
`;

const SettingButton = styled(Link)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => (theme.fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.9;
  }
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray['600']}; /* Using gray 600 for button text */
  border: 1px solid ${({ theme }) => theme.colors.gray['300']}; /* Using gray 300 for border */
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']}; /* 8px 12px */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
`;

// 건강 정보 섹션 전체를 감싸는 컨테이너
const HealthInfoContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.width.md};
  text-align: left;
`;

// 건강 정보 섹션 헤더 (제목과 버튼을 포함)
const HealthInfoSectionHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 차트와의 간격 조정을 위해 더 크게 설정 */
  display: flex;
  align-items: center;
  justify-content: space-between; /* 제목과 버튼을 양 끝으로 정렬 */
  width: 100%; /* 부모 컨테이너 너비에 맞춤 */
`;

// 건강정보 입력 버튼 스타일
const HealthInfoInputButton = styled(SettingButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.width.md};
  height: 400px;
  margin-bottom: ${({ theme }) => theme.spacing['8']};
`;

const AlertBar = styled.div`
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeba8;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  width: 100%;
  max-width: ${({ theme }) => theme.width.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
`;

// New styled component for the FaBell icon
const StyledFaBell = styled(FaBell)`
  font-size: ${({ theme }) => theme.fontSizes.lg}; /* Adjust size if needed, e.g., 18px */
  color: #856404;
  flex-shrink: 0; /* Prevent the icon from shrinking */
`;

const SectionBlock = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.width.md};
  text-align: left;
`;

const SectionHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  padding-top: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const SectionLink = styled(Link)`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing['3']} 0;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  margin-top: ${({ theme }) => theme.spacing['8']};
  margin-bottom: 0;
`;

// 모달 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 내용 컨테이너
const ModalContent = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing['6']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  text-align: left; /* 폼 요소 정렬을 위해 left로 변경 */
  position: relative;
  display: flex; /* 내부 요소 정렬을 위해 flex 추가 */
  flex-direction: column; /* 세로 방향으로 정렬 */
`;

// 모달 헤더
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  width: 100%; /* 너비를 100%로 설정 */
`;

// 모달 타이틀
const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  flex-grow: 1; /* 남은 공간을 차지하여 중앙 정렬에 도움 */
  text-align: center; /* 타이틀 중앙 정렬 */
`;

// 닫기 버튼
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  padding: 0;
  position: absolute; /* 절대 위치를 사용하여 오른쪽 상단에 배치 */
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1; /* 텍스트 높이 조정 */
`;

// 모달 내 폼 그룹
const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']}; /* 입력 필드 사이 간격 */
  margin-bottom: ${({ theme }) => theme.spacing['5']}; /* 확인 버튼과의 간격 */
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 라벨과 인풋을 왼쪽 정렬 */
  position: relative;
`;

// 입력 필드 라벨
const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 라벨과 인풋 사이 간격 */
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

// 입력 필드
const InputField = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const ModalSelectButton = styled(ButtonStyle)`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.base};

  display: block;
  margin: ${({ theme }) => theme.spacing['4']} auto 0 auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.85em;
  margin-top: ${({ theme }) => theme.spacing['1']};
  margin-left: 5px;
  text-align: left;
  width: calc(100% - 120px);
  box-sizing: border-box;
  position: relative;
  flex-basis: 100%;
`;
