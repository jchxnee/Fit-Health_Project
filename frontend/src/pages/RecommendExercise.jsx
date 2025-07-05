import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TitleBar from '../components/TitleBar.jsx';
import CategoryMenu from '../components/CategoryMenu.jsx';
import BMICalculator from '../components/RecommendExercise/BMICalculator.jsx';
import RecommendRoutine from '../components/RecommendExercise/RecommendRoutine.jsx';

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
  const location = useLocation();
  const initialCategory = location.state?.category || '헬스';

  const [bmi, setBmi] = useState('');
  const [recommendList, setRecommendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const allCategories = ['전체', '헬스', '요가', '도수', '재활'];
  const visibleCategories = allCategories.filter(
    (category) => category !== '도수' && category !== '재활' && category !== '전체'
  );

  return (
    <>
      <HeaderContainer>
        <TitleBar title="운동 추천" />
      </HeaderContainer>
      <MainRow>
        <CategoryMenuWrapper>
          <CategoryMenu
            categories={visibleCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => setSelectedCategory(category)}
          />
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
            selectedCategory={selectedCategory}
          />
        </ContentWrapper>
      </MainRow>
    </>
  );
}

export default RecommendExercise;
