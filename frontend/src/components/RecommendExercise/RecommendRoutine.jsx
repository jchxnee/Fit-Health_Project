import React from 'react';
import styled from 'styled-components';
import theme from "../../styles/theme.js";
import { getRecommendExercise } from '../../api/recommend';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  max-width: 1008px;
  width: 100%;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: ${theme.spacing[8]};
  border-bottom: 2px solid ${theme.colors.primary};
  padding-bottom: ${theme.spacing[2]};
`;

const Category = styled.button`
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-bottom: 2px solid ${theme.colors.black};
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
  '헬스': 'Health',
  '요가': 'Yoga',
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
                          }) {
  const handleRecommend = async () => {
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

  return (
    <PageContainer>
      <Title>
        <button onClick={handleRecommend} disabled={loading || !bmi}>
          {loading ? '추천 중...' : '루틴 추천받기'}
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Title>

      <Table>
          <TableRow>
            <TableHeader>운동</TableHeader>
            <TableHeader>부위</TableHeader>
            <TableHeader>장비</TableHeader>
            <TableHeader>무게</TableHeader>
            <TableHeader>횟수</TableHeader>
            <TableHeader>세트</TableHeader>
          </TableRow>
        {recommendList.map((item, idx) => (
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
          ))}
      </Table>
    </PageContainer>
  );
}

export default RecommendRoutine;
