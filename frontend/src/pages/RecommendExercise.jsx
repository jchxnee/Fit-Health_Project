import React, { useState, useCallback } from 'react'; // <-- useCallback 임포트 추가
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TitleBar from '../components/TitleBar.jsx';
import CategoryMenu from '../components/CategoryMenu.jsx';
import BMICalculator from '../components/RecommendExercise/BMICalculator.jsx';
import RecommendRoutine from '../components/RecommendExercise/RecommendRoutine.jsx';
import RecommendDiet from '../components/RecommendExercise/RecommendDiet.jsx';
import BMRCalculator from '../components/RecommendExercise/BMRCalculator.jsx';

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
  gap: 30px;
`;

function RecommendExercise() {
  const location = useLocation();

  const initialMainCategory = location.state?.mainCategory || 'AI 추천 운동';
  const initialSubCategory = location.state?.subCategory || '헬스';

  const [bmi, setBmi] = useState('');

  const [userDataForDietRecommendation, setUserDataForDietRecommendation] = useState(null);

  const [recommendList, setRecommendList] = useState([]);
  const [goalCategory, setGoalCategory] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMainCategory, setSelectedMainCategory] = useState(initialMainCategory);
  const [selectedExerciseSubCategory, setSelectedExerciseSubCategory] = useState(initialSubCategory);

  const mainCategories = ['AI 추천 운동', 'AI 추천 식단'];

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category);
    setRecommendList([]);
    setDietPlan(null); // 식단 초기화
    setError(null);

    if (category === 'AI 추천 운동') {
      setSelectedExerciseSubCategory('헬스');
      setGoalCategory('');
    } else {
      setGoalCategory('체지방 감량');
      setSelectedExerciseSubCategory('');
    }
  };

  const handleSubCategorySelect = (category) => {
    setSelectedExerciseSubCategory(category);
    setRecommendList([]);
    setError(null);
  };

  const handleBMRDataFromCalculator = useCallback((data) => {
    setUserDataForDietRecommendation(data);
    console.log('BMRCalculator에서 받은 모든 데이터:', data);
  }, []);

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
          {selectedMainCategory === 'AI 추천 운동' && <BMICalculator bmi={bmi} setBmi={setBmi} />}
          {selectedMainCategory === 'AI 추천 식단' && <BMRCalculator setUserData={handleBMRDataFromCalculator} />}
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
            <RecommendDiet
              goalCategory={goalCategory}
              setGoalCategory={setGoalCategory}
              dietPlan={dietPlan}
              setDietPlan={setDietPlan}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
              userData={userDataForDietRecommendation}
            />
          )}
        </ContentWrapper>
      </MainRow>
    </>
  );
}

export default RecommendExercise;
