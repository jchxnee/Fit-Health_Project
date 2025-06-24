import React, { useState, useEffect } from 'react';
import TrainerPhoto from '../../components/CoachMatching/TrainerPhoto';
import TrainerReview from '../../components/CoachMatching/TrainerReview'; // 경로 확인
import ButtonTitleBar from '../../components/CoachMatching/ButtonTitleBar';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import TrainerQualifications from '../../components/CoachMatching/TrainerSpec';
import TrainerProfile from '../../components/CoachMatching/TrainerProfile';
import TrainerCourse from '../../components/CoachMatching/TrainerCourse';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
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

const NavItem = styled(Link)`
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
  const { id } = useParams(); // URL에서 트레이너 번호 (id)를 가져옵니다.
  // const trainerNo = id; // 명확히 trainerNo로 사용할 수 있습니다.

  const [trainerDetails, setTrainerDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachData = async () => {
      if (!id) {
        // id가 trainerNo입니다.
        setLoading(false);
        setError('트레이너 번호가 제공되지 않았습니다.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Promise.all을 사용하여 트레이너 상세 정보와 리뷰를 병렬로 가져옵니다.
        const [trainerResponse, reviewsResponse] = await Promise.all([
          api.get(`/api/trainer/${id}`), // 트레이너 상세 정보 API (id가 trainerNo)
          api.get(`${API_ENDPOINTS.REVIEW.SELECT}${id}`),
        ]);

        console.log('CoachDetail - Trainer Details Response:', trainerResponse.data);
        setTrainerDetails(trainerResponse.data);

        const fetchedReviews = reviewsResponse.data.map((review) => ({
          reviewId: review.reviewId,
          userName: review.userName,
          userProfileImage: review.userProfileImage,
          createdAt: review.createdAt,
          rating: review.rating,
          reviewContent: review.reviewContent,
          reviewImage: review.reviewImage,
          recommendCount: review.recommendCount,
          isRecommended: false,
        }));
        console.log('CoachDetail - Processed Reviews Data for TrainerReview:', fetchedReviews);
        setReviews(fetchedReviews); // 가공된 데이터를 TrainerReview로 전달
      } catch (err) {
        console.error('CoachDetail - Failed to fetch data:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [id]); // id(trainerNo)가 변경될 때마다 데이터를 다시 불러옵니다.

  if (loading) {
    return <PageWrapper>로딩 중...</PageWrapper>;
  }
  if (error) {
    return <PageWrapper>에러: {error}</PageWrapper>;
  }
  if (!trainerDetails) {
    return <PageWrapper>트레이너 정보를 찾을 수 없습니다.</PageWrapper>;
  }

  const currentTrainer = {
    name: trainerDetails.trainerName,
    email: `trainer${id}@example.com`, // trainerNo 기반으로 임시 이메일 생성
    id: trainerDetails.trainerNo, // trainerNo
    specialty: trainerDetails.majorName,
    kakaoId: trainerDetails.kakaoId,
    instagramId: trainerDetails.instaId,
    location: trainerDetails.wishArea,
    introduction: trainerDetails.introduce,
    imageUrl: trainerDetails.profileImage || '../../../public/img/minju.png',
  };

  const trainerQuals = trainerDetails.careers.map((career) => ({ text: career }));

  const trainerCourses = [
    {
      count: '1회',
      description: '핏헬스 회원가',
      price: `${trainerDetails.oncePrice.toLocaleString()}원`,
      discount: null,
    },
    {
      count: '3회 이상',
      description: '핏헬스 회원가',
      price: null,
      discount: `${trainerDetails.discount3}%`,
    },
    {
      count: '5회 이상',
      description: '핏헬스 회원가',
      price: null,
      discount: `${trainerDetails.discount5}%`,
    },
    {
      count: '10회 이상',
      description: '핏헬스 회원가',
      price: null,
      discount: `${trainerDetails.discount10}%`,
    },
  ];

  return (
    <>
      <PageWrapper>
        <TitleBarContainer>
          <ButtonTitleBar title={'핏코치 매칭'} />
          <NavItem to={`/coachModify/${id}`}>
            수정 <FiEdit />
          </NavItem>
        </TitleBarContainer>
        <TrainerProfile trainer={currentTrainer} />
        <TrainerQualifications qualifications={trainerQuals} />
        <TrainerCourse courses={trainerCourses} />
        <TrainerPhoto photos={trainerDetails.trainerPhoto} />
        <TrainerReview trainerNo={id} reviews={reviews} /> {/* <<== trainerNo로 prop을 전달합니다. */}
      </PageWrapper>
    </>
  );
};

export default CoachDetail;
