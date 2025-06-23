import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import kakaotalkIcon from '/public/img/kakaotalk.png';
import { FaBell } from 'react-icons/fa';
import { LuClipboardList } from 'react-icons/lu';
import { AiOutlineTool } from 'react-icons/ai';
import { ResponsiveLine } from '@nivo/line';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import ButtonStyle from '../../styles/common/Button';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import basicProfile from '../../../public/img/basicProfile.jpg';
import emailIcon from '../../../public/img/email.png';
import { useHealthForm } from '../../hooks/member/useHealthForm';
import { healthService } from '../../api/health';
import { toast } from 'react-toastify';

const MyPage = () => {
  const { user } = useUserStore();

  // raw 데이터 → 차트용 데이터 변환
  const transformHealthData = (rawData) => {
    console.log(rawData);
    const weightData = [];
    const skeletalMuscleData = [];
    const bodyFatData = [];

    rawData.forEach((item) => {
      const date = new Date(item.create_date); // 소문자 필드명
      const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
        date.getDate()
      ).padStart(2, '0')}`;

      weightData.push({ x: formattedDate, y: item.weight });
      skeletalMuscleData.push({ x: formattedDate, y: item.skeletal_muscle });
      bodyFatData.push({ x: formattedDate, y: item.body_fat });
    });

    return [
      { id: '체중 (kg)', data: weightData },
      { id: '골격근량 (kg)', data: skeletalMuscleData },
      { id: '체지방량 (kg)', data: bodyFatData },
    ];
  };

  // 차트 데이터 상태
  const [chartData, setChartData] = useState([]);
  const [isHealthInputModalOpen, setIsHealthInputModalOpen] = useState(false);

  // 🧾 건강 정보 입력 폼 Hook
  const { register, handleSubmit, onSubmit, errors, isLoading, reset } = useHealthForm({
    useremail: user.email,
    onSuccess: async () => {
      try {
        const freshData = await healthService.getHealthData(user.email);
        const transformed = transformHealthData(freshData);
        setChartData(transformed); // 최신 데이터 반영
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
        const converted = transformHealthData(raw);
        setChartData(converted);
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
              <ProfileIcon src={emailIcon} alt="email" />
              {user.email}
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
            <div style={{ height: '400px' }}>
              {chartData.length === 0 || chartData.every((item) => item.data.length === 0) ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>건강 데이터가 없습니다.</p>
              ) : (
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
              )}
            </div>
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
          <SectionLink to={`/coachModify/${user.trainerNo}`}>핏코치 정보 수정</SectionLink>
          <SectionLink to="/myPostsPage">내가 작성한 게시물/댓글</SectionLink>
          <SectionLink to="/myReviewsPage" state={{ userEmail: user.email }}>
            내가 작성한 리뷰
          </SectionLink>
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
