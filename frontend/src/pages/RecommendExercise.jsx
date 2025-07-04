import Routine from '../components/RecommendExercise/Routine.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import TitleBar from '../components/TitleBar.jsx';
import CategoryMenu from '../components/CategoryMenu.jsx';
import BMICalculator from '../components/RecommendExercise/BMICalculator.jsx';
import RecommendRoutine from '../components/RecommendExercise/RecommendRoutine.jsx';
import styled from 'styled-components';
import { useState } from 'react';

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MainRow = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1008px;
  margin: 0 auto;
  gap: 44px;
`;

const CategoryMenuWrapper = styled.div`
  width: 200px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 34px 10px;
`;

const ContentWrapper = styled.div`
  width: 654px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 59px;
`;

function RecommendExercise() {
  const [bmi, setBmi] = useState('');
  const [recommendList, setRecommendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <HeaderContainer>
        <TitleBar title="운동 추천" />
      </HeaderContainer>
      <MainRow>
        <CategoryMenuWrapper>
          <CategoryMenu />
        </CategoryMenuWrapper>
        <ContentWrapper>
          <BMICalculator bmi={bmi} setBmi={setBmi} />
          <RecommendRoutine
            bmi={bmi}
            recommendList={recommendList}
            setRecommendList={setRecommendList}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
          {/*<Routine />*/}
        </ContentWrapper>
      </MainRow>
    </>
  );
}

export default RecommendExercise;
