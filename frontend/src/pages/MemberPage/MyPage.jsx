import React, { useState } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import UserProfileImage from '/public/img/minju.png';
import kakaotalkIcon from '/public/img/kakaotalk.png';
import { FaBell } from 'react-icons/fa';
import { LuClipboardList } from 'react-icons/lu';
import { AiOutlineTool } from 'react-icons/ai';
import { ResponsiveLine } from '@nivo/line';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { CiCircleInfo } from 'react-icons/ci';
import ButtonStyle from '../../styles/common/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import betaImg from '../../assets/beta_user_img.png'; // 이미지 경로에 맞게 수정
import { Link } from 'react-router-dom';

const bodyMetrics = [
  {
    id: '체중 (kg)',
    data: [
      { x: '2022.09.23', y: 65.7 },
      { x: '2022.11.09', y: 68.6 },
      { x: '2022.12.08', y: 70.6 },
      { x: '2023.05.16', y: 70.9 },
      { x: '2023.08.07', y: 72.2 },
      { x: '2023.10.05', y: 76.3 },
      { x: '2023.12.30', y: 73.0 },
      { x: '2024.03.15', y: 72.5 },
      { x: '2024.06.20', y: 71.0 },
      { x: '2024.09.01', y: 70.2 },
    ],
  },
  {
    id: '골격근량 (kg)',
    data: [
      { x: '2022.09.23', y: 29.3 },
      { x: '2022.11.09', y: 31.2 },
      { x: '2022.12.08', y: 32.5 },
      { x: '2023.05.16', y: 34.8 },
      { x: '2023.08.07', y: 35.2 },
      { x: '2023.10.05', y: 35.7 },
      { x: '2023.12.30', y: 34.1 },
      { x: '2024.03.15', y: 34.5 },
      { x: '2024.06.20', y: 34.0 },
      { x: '2024.09.01', y: 33.5 },
    ],
  },
  {
    id: '체지방량 (kg)',
    data: [
      { x: '2022.09.23', y: 13.4 },
      { x: '2022.11.09', y: 13.2 },
      { x: '2022.12.08', y: 13.2 },
      { x: '2023.05.16', y: 9.7 },
      { x: '2023.08.07', y: 10.5 },
      { x: '2023.10.05', y: 13.8 },
      { x: '2023.12.30', y: 13.1 },
      { x: '2024.03.15', y: 12.8 },
      { x: '2024.06.20', y: 12.0 },
      { x: '2024.09.01', y: 11.5 },
    ],
  },
];

const MyPage = () => {
  const [chartData, setChartData] = useState(bodyMetrics);
  const [isHealthInputModalOpen, setIsHealthInputModalOpen] = useState(false); // 모달 상태 추가
  const [user] = useState({ name: '김현아', img: betaImg });

  // 모달 입력 필드 상태 추가
  const [healthDataInput, setHealthDataInput] = useState({
    weight: '',
    bodyFatMass: '',
    skeletalMuscleMass: '',
  });

  const openHealthInputModal = () => setIsHealthInputModalOpen(true);
  const closeHealthInputModal = () => {
    setIsHealthInputModalOpen(false);
    // 모달 닫을 때 입력 필드 초기화
    setHealthDataInput({
      weight: '',
      bodyFatMass: '',
      skeletalMuscleMass: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 숫자만 입력 가능하도록 필터링 (소수점 포함)
    const numericValue = value.replace(/[^0-9.]/g, '');
    setHealthDataInput((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleSubmitHealthData = () => {
    // 실제 데이터 처리 로직 (예: API 호출, 차트 데이터 업데이트)
    console.log('입력된 건강 정보:', healthDataInput);
    // 여기에 차트 데이터 업데이트 로직을 추가할 수 있습니다.
    // 예: 새로운 날짜로 데이터 추가
    // const newDate = new Date().toISOString().slice(0, 10).replace(/-/g, '.'); // 오늘 날짜
    // setChartData((prevData) => {
    //   const updatedData = [...prevData];
    //   // 체중 데이터 업데이트
    //   const weightIndex = updatedData.findIndex(item => item.id === '체중 (kg)');
    //   if (weightIndex !== -1) {
    //     updatedData[weightIndex].data.push({ x: newDate, y: parseFloat(healthDataInput.weight) });
    //   }
    //   // 골격근량 데이터 업데이트
    //   const muscleIndex = updatedData.findIndex(item => item.id === '골격근량 (kg)');
    //   if (muscleIndex !== -1) {
    //     updatedData[muscleIndex].data.push({ x: newDate, y: parseFloat(healthDataInput.skeletalMuscleMass) });
    //   }
    //   // 체지방량 데이터 업데이트
    //   const bodyFatIndex = updatedData.findIndex(item => item.id === '체지방량 (kg)');
    //   if (bodyFatIndex !== -1) {
    //     updatedData[bodyFatIndex].data.push({ x: newDate, y: parseFloat(healthDataInput.bodyFatMass) });
    //   }
    //   return updatedData;
    // });
    closeHealthInputModal();
  };

  return (
    <>
      <Header user={user} />
      <PageContainer>
        <TitleBar title={'마이페이지'} />

        <ProfileSection>
          <ProfileImage src={UserProfileImage} alt="Coach Avatar" />
          <ProfileInfo>
            <ProfileName>김현아님</ProfileName>
            <ProfileEmail>
              <ProfileIcon src={kakaotalkIcon} alt="KakaoTalk" />
              haha020911@naver.com
            </ProfileEmail>
          </ProfileInfo>
          <SettingButton to="/accountSettingPage">계정 설정</SettingButton>
        </ProfileSection>

        <AlertBar>
          <StyledFaBell />
          읽지 않은 알림이 3개 있습니다.
        </AlertBar>

        {/* 건강 정보 섹션 추가 */}
        <HealthInfoContainer>
          <HealthInfoSectionHeader>
            <SectionHeader>
              건강 정보
              <MdOutlineHealthAndSafety />
            </SectionHeader>
            <HealthInfoInputButton onClick={openHealthInputModal}>건강정보 입력</HealthInfoInputButton>
          </HealthInfoSectionHeader>
          <ChartContainer>
            <ResponsiveLine
              data={chartData}
              margin={{ top: 50, right: 140, bottom: 70, left: 50 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: '날짜',
                legendOffset: 50,
                legendPosition: 'middle',
                truncateTickAt: 0,
                format: (value) => {
                  const parts = value.split('.');
                  return parts.length === 3 ? `${parts[1]}.${parts[2]}` : value;
                },
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '값 (kg)',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              colors={['#FF5733', '#3366FF', '#33CC33']}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: '#d4d4d4',
                      strokeWidth: 1,
                    },
                  },
                  ticks: {
                    line: {
                      stroke: '#d4d4d4',
                      strokeWidth: 1,
                    },
                    text: {
                      fontSize: 11,
                      fill: '#333333',
                    },
                  },
                  legend: {
                    text: {
                      fontSize: 12,
                      fill: '#333333',
                      fontWeight: 'bold',
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: '#e0e0e0',
                    strokeWidth: 1,
                  },
                },
                legends: {
                  text: {
                    fontSize: 12,
                    fill: '#333333',
                  },
                },
                tooltip: {
                  container: {
                    background: 'white',
                    color: '#333333',
                    fontSize: 12,
                    borderRadius: '4px',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                  },
                },
              }}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </ChartContainer>
          <Divider />
        </HealthInfoContainer>

        <SectionBlock>
          <SectionHeader>
            내역
            <LuClipboardList />
          </SectionHeader>
          <SectionLink to="/matchingList">신청 내역</SectionLink>
          <Divider />
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>
            관리
            <AiOutlineTool />
          </SectionHeader>
          <SectionLink to="/coachRegister">핏코치 정보 수정</SectionLink>
          <SectionLink to="/myPostsPage">내가 작성한 게시물/댓글</SectionLink>
          <SectionLink to="/myReviewsPage">내가 작성한 리뷰</SectionLink>
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
              <FormGroup>
                {' '}
                {/* 폼 그룹 추가 */}
                <InputContainer>
                  <InputLabel htmlFor="weight">몸무게 (kg)</InputLabel>
                  <InputField
                    type="number" // 숫자만 입력 받도록
                    id="weight"
                    name="weight"
                    value={healthDataInput.weight}
                    onChange={handleInputChange}
                    placeholder="예: 70.5"
                    step="0.1" // 소수점 입력 가능
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel htmlFor="bodyFatMass">체지방량 (kg)</InputLabel>
                  <InputField
                    type="number"
                    id="bodyFatMass"
                    name="bodyFatMass"
                    value={healthDataInput.bodyFatMass}
                    onChange={handleInputChange}
                    placeholder="예: 15.2"
                    step="0.1"
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel htmlFor="skeletalMuscleMass">골격근량 (kg)</InputLabel>
                  <InputField
                    type="number"
                    id="skeletalMuscleMass"
                    name="skeletalMuscleMass"
                    value={healthDataInput.skeletalMuscleMass}
                    onChange={handleInputChange}
                    placeholder="예: 30.1"
                    step="0.1"
                  />
                </InputContainer>
              </FormGroup>
              <ModalSelectButton onClick={handleSubmitHealthData}>확인</ModalSelectButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
      <Footer />
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
    gap: ${({ theme }) => theme.spacing['3']}; /* Smaller gap on mobile */
    align-items: flex-start; /* Align text left within column flow for profile info */
  }
`;

const ProfileImage = styled.img`
  width: 80px; /* Fixed size for avatar */
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full}; /* Circular image */
  object-fit: cover;
  flex-shrink: 0; /* Prevent shrinking */

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    width: 60px;
    height: 60px;
    margin-bottom: ${({ theme }) => theme.spacing['2']}; /* Add space below image on mobile */
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align text to the left */
  flex-grow: 1; /* Allow to take available space */
  gap: ${({ theme }) => theme.spacing['0']};

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    align-items: center; /* Center text when column layout */
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
  color: #856404; /* Match the text color of the alert bar */
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
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']}; /* 입력 필드 사이 간격 */
  margin-bottom: ${({ theme }) => theme.spacing['5']}; /* 확인 버튼과의 간격 */
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 라벨과 인풋을 왼쪽 정렬 */
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
    border-color: ${({ theme }) => theme.colors.secondary}; /* 포커스 시 색상 변경 */
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  /* 화살표 버튼 숨기기 (type="number" 기본 UI) */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield; /* Firefox */
`;

// 모달 확인 버튼 (가운데 정렬)
const ModalSelectButton = styled(ButtonStyle)`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.base};

  display: block; /* 블록 요소로 만들어 margin: auto 적용 가능하게 함 */
  margin: ${({ theme }) => theme.spacing['4']} auto 0 auto; /* 상단 여백 및 좌우 자동 마진으로 중앙 정렬 */
`;
