import React, { useState, useEffect } from 'react';
import TrainerPhoto from '../../components/CoachMatching/TrainerPhoto';
import TrainerReview from '../../components/CoachMatching/TrainerReview';
import ButtonTitleBar from '../../components/CoachMatching/ButtonTitleBar';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import TrainerQualifications from '../../components/CoachMatching/TrainerSpec';
import TrainerProfile from '../../components/CoachMatching/TrainerProfile';
import TrainerCourse from '../../components/CoachMatching/TrainerCourse';
import { useParams } from 'react-router-dom'; // useParams 임포트 확인
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.white};
  margin-top: 20px;
  margin-bottom: 100px;
`;

const TitleBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${theme.width.lg};
  padding: 0;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray['400']};
`;

const EditButton = styled.button`
  width: ${theme.spacing['20']};
  height: ${theme.spacing['8']};
  background-color: ${theme.colors.button};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.colors.primaryDark};
    opacity: 90%;
  }
`;

const CoachDetail = () => {
  // URL 파라미터에서 트레이너 ID를 가져옴 (현재 URL이 /coach/:id 이므로 'id'를 사용)
  const { id } = useParams(); // useParams가 정확히 임포트되었는지 확인해주세요.

  // 디버깅을 위해 id 값 확인
  console.log('CoachDetail - Trainer ID from URL:', id);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      // id가 없으면 API 호출하지 않음
      if (!id) {
        setLoading(false);
        console.log('CoachDetail - Trainer ID is missing, skipping review fetch.');
        // 만약 ID가 필수라면 에러 상태를 설정할 수도 있습니다.
        // setError('트레이너 ID가 유효하지 않습니다.');
        return;
      }

      setLoading(true);
      setError(null); // 새로운 fetch 시도 전에 에러 상태 초기화
      try {
        // API_ENDPOINTS.REVIEW.SELECT 가 백엔드의 /api/reviews/ 경로와 일치한다고 가정
        // 백엔드 API도 이제 트레이너 ID (숫자)를 받도록 수정되어야 합니다.
        const apiUrl = `${API_ENDPOINTS.REVIEW.SELECT}${id}`;
        console.log('CoachDetail - Attempting to fetch reviews from:', apiUrl);

        const response = await api.get(apiUrl);
        console.log('CoachDetail - API Response data:', response.data); // ★★★ 여기가 핵심!
        setReviews(response.data);
      } catch (err) {
        console.error('CoachDetail - Failed to fetch reviews:', err); // API 호출 실패 시 에러 로그
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]); // 의존성 배열을 id로 변경 (id가 변경될 때마다 다시 호출)

  // 현재는 하드코딩된 더미 트레이너 정보입니다.
  // 실제 서비스에서는 id를 사용하여 백엔드로부터 해당 트레이너의 상세 정보를 불러와야 합니다.
  const currentTrainer = {
    name: '김성은',
    // 현재 URL이 ID 기반이므로, email은 직접 가져오지 못합니다.
    // 필요하다면 ID로 이메일을 조회하는 API 호출을 추가하거나, TrainerReview에 ID를 전달해야 합니다.
    email: `trainer${id}@example.com`, // 임시로 ID 기반 이메일 생성 또는 나중에 실제 데이터로 대체
    id: id, // 트레이너 ID를 저장
    specialty: '헬스 전문',
    kakaoId: 'asd1234',
    instagramId: 'intae_0802',
    location: '서울특별시 강남구',
    introduction:
      '안녕하세요. 김성은 트레이너입니다! 여러분들의 몸과 마음을\n건강하게 만들어드리겠습니다! 운동은 나랑같이해요~~~',
    imageUrl: '../../../public/img/minju.png',
  };

  const trainerQuals = [
    { text: '국가공인 생활스포츠지도사 자격 보유 (생활체육지도사 2급 - 보디빌딩)' },
    { text: '전국 피트니스 대회 입상 경력 (2023 NABBA WFF KOREA 스포츠 모델 부문 2위)' },
    { text: 'PT 경력 5년 이상, 누적 회원 수 300명 이상 지도 (다양한 연령층과 목적별 운동 지도 경험)' },
    { text: '재활 및 체형교정 전문 교육 수료 (CES KOREA 재활 트레이닝 과정 이수)' },
  ];
  const trainerCourses = [
    { count: '1회', description: '핏헬스 회원가', price: '50,000원', discount: null },
    { count: '3회 이상', description: '핏헬스 회원가', price: null, discount: '3%' },
    { count: '5회 이상', description: '핏헬스 회원가', price: null, discount: '5%' },
    { count: '10회 이상', description: '핏헬스 회원가', price: null, discount: '10%' },
  ];

  // 이 console.log는 컴포넌트가 렌더링될 때마다 실행됩니다.
  console.log('CoachDetail - Reviews data state:', reviews);

  // 로딩 및 에러 상태에 따른 UI 렌더링
  if (loading) {
    return <PageWrapper>로딩 중...</PageWrapper>;
  }
  if (error) {
    return <PageWrapper>에러: {error}</PageWrapper>;
  }

  return (
    <>
      <PageWrapper>
        <TitleBarContainer>
          <ButtonTitleBar title={'핏코치 매칭'} />
          <EditButton>
            수정 <FiEdit />
          </EditButton>
        </TitleBarContainer>
        <TrainerProfile trainer={currentTrainer} />
        <TrainerQualifications qualifications={trainerQuals} />
        <TrainerCourse courses={trainerCourses} />
        <TrainerPhoto />
        {/* TrainerReview 컴포넌트에 트레이너 ID와 불러온 리뷰 데이터 전달 */}
        {/* TrainerReview 내부에서 '리뷰 더보기' 링크를 위해 trainerId를 전달합니다. */}
        <TrainerReview trainerId={id} reviews={reviews} /> {/* prop 이름을 trainerId로 명확히 변경 */}
      </PageWrapper>
    </>
  );
};

export default CoachDetail;
