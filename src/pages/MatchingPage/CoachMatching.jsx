import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RecommendedExerciseSection from '../../components/TitleBar';

const PageWrapper = styled.div`
  width: ${theme.width.lg};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CoachMatching = () => {
  return (
    <>
      <Header />
      <PageWrapper>
        <RecommendedExerciseSection title={'신청'} />
      </PageWrapper>
      <Footer />
    </>
  );
};

export default CoachMatching;
