import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TrainerPhoto from '../../components/CoachMatching/TrainerPhoto';
import TrainerReview from '../../components/CoachMatching/TrainerReview';
import RecommendedExerciseSection from '../../components/TitleBar';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';

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
  max-width: 100%;
  padding: 0 ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const EditButton = styled.button`
  width: ${theme.spacing['24']};
  height: ${theme.spacing['10']};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const CoachDetail = () => {
  return (
    <>
      <Header />
      <PageWrapper>
        <TitleBarContainer>
          <RecommendedExerciseSection title={'핏코치 매칭'} />
          <EditButton>
            수정 <FiEdit />
          </EditButton>
        </TitleBarContainer>
        <TrainerPhoto />
        <TrainerReview />
      </PageWrapper>
      <Footer />
    </>
  );
};

export default CoachDetail;
