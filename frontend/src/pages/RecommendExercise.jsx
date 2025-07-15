// src/pages/RecommendExercise.jsx
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

  const initialMainCategory = location.state?.mainCategory || 'AI 추천 운동';

  const initialSubCategory = location.state?.subCategory || '헬스';

  const [bmi, setBmi] = useState('');
  const [recommendList, setRecommendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMainCategory, setSelectedMainCategory] = useState(initialMainCategory);

  const [selectedExerciseSubCategory, setSelectedExerciseSubCategory] = useState(initialSubCategory);

  const mainCategories = ['AI 추천 운동', 'AI 추천 식단'];

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category);

    setRecommendList([]);
    setError(null);

    if (category === 'AI 추천 운동') {
      setSelectedExerciseSubCategory('헬스');
    } else {
      setSelectedExerciseSubCategory('');
    }
  };

  const handleSubCategorySelect = (category) => {
    setSelectedExerciseSubCategory(category);
    setRecommendList([]);
    setError(null);
  };

  return (
    <>
      <HeaderContainer>
        <TitleBar title={selectedMainCategory} />
      </HeaderContainer>
      <MainRow>
        <CategoryMenuWrapper>
          <CategoryMenu
            categories={mainCategories}
            selectedCategory={selectedMainCategory}
            onSelectCategory={handleMainCategorySelect}
          />
        </CategoryMenuWrapper>
        <ContentWrapper>
          <BMICalculator bmi={bmi} setBmi={setBmi} />

          {selectedMainCategory === 'AI 추천 운동' && (
            <RecommendRoutine
              bmi={bmi}
              recommendList={recommendList}
              setRecommendList={setRecommendList}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
              selectedCategory={selectedExerciseSubCategory}
              onSelectSubCategory={handleSubCategorySelect}
            />
          )}

          {selectedMainCategory === 'AI 추천 식단' && (
            <div>
              <h2>AI 추천 식단 페이지</h2>
              <p>여기에 식단 추천 관련 내용을 추가할 예정입니다.</p>
            </div>
          )}
        </ContentWrapper>
      </MainRow>
    </>
  );
}

export default RecommendExercise;
