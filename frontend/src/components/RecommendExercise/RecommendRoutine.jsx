import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import SubCategoryMenu from './SubCategoryMenu';

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${theme.spacing[8]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  padding: ${theme.spacing[3]};
  text-align: center;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.gray100};
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing[3]};
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.black};
`;

const renderDietItems = (items) => {
  if (!items || items.length === 0) return '없음';
  return items.map((item, i) => (
    <span key={i}>
      {item.name} ({item.kcal}kcal){i < items.length - 1 && ', '}
    </span>
  ));
};

const RecommendDiet = ({
  goalCategory,
  setGoalCategory,
  dietPlan,
  setDietPlan,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const goalOptions = ['체지방 감량', '벌크업', '건강관리', '체중 유지'];

  const handleRecommend = async () => {
    if (!goalCategory || goalCategory === '목적 선택') {
      setError('목적을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // const result = await getRecommendDiet(goalCategory);
      // setDietPlan(result);
    } catch (e) {
      setError('식단 추천에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <TitleSection>
        <SubCategoryMenu
          categories={goalOptions}
          selectedSubCategory={goalCategory}
          onSelectSubCategory={setGoalCategory}
        />
        <RecommendButton onClick={handleRecommend} disabled={loading || !goalCategory || goalCategory === '목적 선택'}>
          {loading ? '추천 중...' : '식단 추천받기'}
        </RecommendButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </TitleSection>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>식사</TableHeader>
            <TableHeader>추천 식단</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {dietPlan?.breakfast?.length || dietPlan?.lunch?.length || dietPlan?.dinner?.length ? (
            <>
              <TableRow>
                <TableCell>아침</TableCell>
                <TableCell>{renderDietItems(dietPlan.breakfast)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>점심</TableCell>
                <TableCell>{renderDietItems(dietPlan.lunch)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>저녁</TableCell>
                <TableCell>{renderDietItems(dietPlan.dinner)}</TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan="2" style={{ padding: '24px', textAlign: 'center' }}>
                추천된 식단 루틴이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default RecommendDiet;
