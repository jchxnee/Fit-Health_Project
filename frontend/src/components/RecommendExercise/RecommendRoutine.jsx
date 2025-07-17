// src/components/RecommendExercise/RecommendRoutine.jsx
import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { getRecommendExercise } from '../../api/recommend';
import SubCategoryMenu from './SubCategoryMenu.jsx';

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
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  padding: ${theme.spacing[3]};
  text-align: center;
`;
const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.white};
  }
`;
const TableCell = styled.td`
  padding: ${theme.spacing[3]};
  text-align: center;
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.sm};

  &.image-cell {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
const ExerciseImage = styled.img`
  width: 80px;
  height: auto;
  border-radius: ${theme.borderRadius.sm};
  object-fit: contain;
`;
const ExerciseName = styled.div`
  font-weight: ${theme.fontWeights.medium};
  margin-top: ${theme.spacing[1]};
  color: ${theme.colors.black};
`;
const categoryMap = {
  헬스: 'Health',
  요가: 'Yoga',
  // 필요시 추가
};

function RecommendRoutine({
  bmi,
  recommendList,
  setRecommendList,
  loading,
  setLoading,
  error,
  setError,
  selectedCategory,
  onSelectSubCategory,
}) {
  const handleRecommend = async () => {
    if (!selectedCategory || selectedCategory === '카테고리 선택') {
      setError('운동 카테고리를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendExercise(bmi, selectedCategory);
      setRecommendList(result);
    } catch (e) {
      setError('추천에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 한글 카테고리명을 영문 폴더명으로 매핑
  const folderName = categoryMap[selectedCategory] || selectedCategory;

  const exerciseSubCategories = ['헬스', '요가']; // 운동 하위 카테고리

  return (
    <PageContainer>
      <TitleSection>
        <SubCategoryMenu
          categories={exerciseSubCategories}
          selectedSubCategory={selectedCategory}
          onSelectSubCategory={onSelectSubCategory}
        />
        <RecommendButton
          onClick={handleRecommend}
          disabled={loading || !bmi || !selectedCategory || selectedCategory === '카테고리 선택'}
        >
          {loading ? '추천 중...' : '운동 추천받기'}
        </RecommendButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </TitleSection>

      <Table>
        <TableRow>
          <TableHeader>운동</TableHeader>
          <TableHeader>부위</TableHeader>
          <TableHeader>장비</TableHeader>
          <TableHeader>무게</TableHeader>
          <TableHeader>횟수</TableHeader>
          <TableHeader>세트</TableHeader>
        </TableRow>
        {recommendList.length > 0 ? (
          recommendList.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="image-cell">
                <ExerciseImage
                  src={`/Eximg/${folderName}/${item.exerciseName}.png`}
                  alt={item.exerciseName}
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <ExerciseName>{item.exerciseName}</ExerciseName>
              </TableCell>
              <TableCell>{item.exerciseTarget}</TableCell>
              <TableCell>{item.exerciseItem}</TableCell>
              <TableCell>{item.exerciseWeight}</TableCell>
              <TableCell>{item.exerciseCount}</TableCell>
              <TableCell>{item.exerciseSet}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="6">추천된 운동 루틴이 없습니다.</TableCell>
          </TableRow>
        )}
      </Table>
    </PageContainer>
  );
}

export default RecommendRoutine;
