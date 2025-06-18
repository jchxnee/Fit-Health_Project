import React from 'react';
import TrainerPhoto from '../../components/CoachMatching/TrainerPhoto';
import TrainerReview from '../../components/CoachMatching/TrainerReview';
import ButtonTitleBar from '../../components/CoachMatching/ButtonTitleBar';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import TrainerQualifications from '../../components/CoachMatching/TrainerSpec';
import TrainerProfile from '../../components/CoachMatching/TrainerProfile';
import TrainerCourse from '../../components/CoachMatching/TrainerCourse';

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
  const trainerQuals = [
    { text: '국가공인 생활스포츠지도사 자격 보유 (생활체육지도사 2급 - 보디빌딩)' },
    { text: '전국 피트니스 대회 입상 경력 (2023 NABBA WFF KOREA 스포츠 모델 부문 2위)' },
    { text: 'PT 경력 5년 이상, 누적 회원 수 300명 이상 지도 (다양한 연령층과 목적별 운동 지도 경험)' },
    { text: '재활 및 체형교정 전문 교육 수료 (CES KOREA 재활 트레이닝 과정 이수)' },
  ];
  const currentTrainer = {
    name: '김성은',
    specialty: '헬스 전문',
    kakaoId: 'asd1234',
    instagramId: 'intae_0802',
    location: '서울특별시 강남구',
    introduction:
      '안녕하세요. 김성은 트레이너입니다! 여러분들의 몸과 마음을\n건강하게 만들어드리겠습니다! 운동은 나랑같이해요~~~',
    imageUrl: '../../../public/img/minju.png',
  };
  const trainerCourses = [
    { count: '1회', description: '핏헬스 회원가', price: '50,000원', discount: null },
    { count: '3회 이상', description: '핏헬스 회원가', price: null, discount: '3%' },
    { count: '5회 이상', description: '핏헬스 회원가', price: null, discount: '5%' },
    { count: '10회 이상', description: '핏헬스 회원가', price: null, discount: '10%' },
  ];
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
        <TrainerReview />
      </PageWrapper>
    </>
  );
};

export default CoachDetail;
