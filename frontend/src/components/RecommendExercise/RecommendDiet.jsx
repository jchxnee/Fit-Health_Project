import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import DietCategoryMenu from './DietCategoryMenu';
import { getRecommendDiet } from '../../api/recommend';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  max-width: 1008px;
  width: 100%;
  margin: 0 auto;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[8]};
  padding-bottom: ${theme.spacing[2]};
  border-bottom: 2px solid ${theme.colors.primary};
  width: 100%;
  justify-content: center;
`;

const RecommendButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.colors.gray400};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryDark};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.red};
  font-size: ${theme.fontSizes.sm};
  margin-left: ${theme.spacing[4]};
`;

const SectionHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  width: 100%;
  padding-bottom: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[10]};
`;

const SectionHeader = styled.h2`
  font-size: ${theme.fontSizes['xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.black};
  padding-left: ${theme.spacing[8]};
  text-align: ${({ align }) => align};
`;

const DietPlanContainer = styled.div`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${theme.spacing[8]};
  background-color: ${theme.colors.white};
`;

const MealRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: ${theme.spacing[5]} 0;
  border-top: 1px solid ${theme.colors.gray300};
  gap: ${theme.spacing[14]};

  &:first-of-type {
    border-top: none;
  }
`;

const MealNameWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-weight: ${theme.fontWeights.bold};
  font-size: ${theme.fontSizes.lg};
  width: 120px;
  flex-shrink: 0;
  line-height: 1.2;
  justify-content: center;
`;

const Icon = styled.span`
  font-size: ${theme.fontSizes['2xl']};
`;

const MealDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  flex-grow: 1;
`;

const DetailItem = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  align-items: flex-start;
  line-height: 1.4;
`;

const Label = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.black};
  white-space: nowrap;
  flex-shrink: 0;
`;

const Content = styled.div`
  font-weight: 400;
  color: ${theme.colors.black};
`;

const DescriptionContent = styled.div`
  font-style: italic;
  color: ${theme.colors.gray700};
`;

const Calories = styled.div`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.black};
`;

const NutrientInfo = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray800};
`;

const TotalCalories = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.black};
  margin-top: ${theme.spacing[4]};
  align-self: flex-end;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const RecommendDiet = ({
  goalCategory,
  setGoalCategory,
  dietPlan,
  setDietPlan,
  loading,
  setLoading,
  error,
  setError,
  userData,
}) => {
  const goalOptions = ['체지방 감량', '벌크업', '건강관리', '체중 유지'];

  const handleRecommend = async () => {
    if (!goalCategory || goalCategory === '목적 선택') {
      setError('목적을 선택해주세요.');
      return;
    }
    if (
      !userData ||
      !userData.name ||
      !userData.gender ||
      !userData.age ||
      !userData.height ||
      !userData.weight ||
      !userData.weeklyExerciseFrequency ||
      !userData.bmr
    ) {
      setError('이름, 성별, 나이, 키, 몸무게, 주 운동 횟수, 기초대사량을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      const requestData = {
        name: userData.name,
        gender: userData.gender,
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
        weeklyExerciseFrequency: userData.weeklyExerciseFrequency,
        bmr: userData.bmr,
        goalCategory: goalCategory,
      };
      const result = await getRecommendDiet(requestData);
      setDietPlan(result);
      console.log('받은 식단 추천 : ', result);
    } catch (e) {
      console.error('식단 추천 호출 실패:', e);
      setError(`식단 추천을 불러오는데 실패하였음: ${e.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderMealRow = (mealKey, mealName) => {
    const meal = dietPlan[mealKey];
    if (!meal) return null;

    let mealIcon = '';
    if (mealKey === 'breakfast') mealIcon = '⛅';
    else if (mealKey === 'lunch') mealIcon = '☀️';
    else if (mealKey === 'dinner') mealIcon = '🌙';

    const menuText = meal.menu?.length ? meal.menu.join(' ') : '없음';

    return (
      <MealRow key={mealKey}>
        <MealNameWithIcon>
          <Icon>{mealIcon}</Icon> {mealName}
        </MealNameWithIcon>
        <MealDetails>
          <DetailItem>
            <Label>메뉴:</Label>
            <Content>{menuText}</Content>
          </DetailItem>
          <DetailItem>
            <Label>설명:</Label>
            <DescriptionContent>{meal.description || '없음'}</DescriptionContent>
          </DetailItem>
          <DetailItem>
            <Label>열량:</Label>
            <Calories>{meal.calories || 'N/A'} kcal</Calories>
          </DetailItem>
          <DetailItem>
            <Label>영양소 비율:</Label>
            <NutrientInfo>
              탄수화물 {meal.nutrients?.carbsPercentage || 0}%, 단백질 {meal.nutrients?.proteinPercentage || 0}%, 지방{' '}
              {meal.nutrients?.fatsPercentage || 0}%
            </NutrientInfo>
          </DetailItem>
        </MealDetails>
      </MealRow>
    );
  };

  return (
    <PageContainer>
      <TitleSection>
        <DietCategoryMenu
          categories={goalOptions}
          selectedSubCategory={goalCategory}
          onSelectSubCategory={setGoalCategory}
        />
        <RecommendButton onClick={handleRecommend} disabled={loading || !goalCategory || goalCategory === '목적 선택'}>
          {loading ? '추천 중...' : '식단 추천받기'}
        </RecommendButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </TitleSection>

      {dietPlan ? (
        <>
          <SectionHeaderContainer>
            <SectionHeader align="center">식사</SectionHeader>
            <SectionHeader align="center">식단 상세</SectionHeader>
          </SectionHeaderContainer>
          <DietPlanContainer>
            {renderMealRow('breakfast', '아침')}
            {renderMealRow('lunch', '점심')}
            {renderMealRow('dinner', '저녁')}
          </DietPlanContainer>

          {dietPlan.totalDailyCalories && (
            <TotalCalories>하루 총 예상 칼로리: {dietPlan.totalDailyCalories} kcal</TotalCalories>
          )}
        </>
      ) : (
        <DietPlanContainer>
          <MealRow>
            <p style={{ width: '100%', textAlign: 'center', padding: '24px' }}>추천된 식단 루틴이 없습니다.</p>
          </MealRow>
        </DietPlanContainer>
      )}
    </PageContainer>
  );
};

export default RecommendDiet;
