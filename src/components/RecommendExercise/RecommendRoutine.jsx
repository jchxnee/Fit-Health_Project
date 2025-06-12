import React from 'react';
import styled from 'styled-components';
import theme from "../../styles/theme.js";

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

const CategoryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: ${theme.spacing[8]};
`;

const Category = styled.span`
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
  &:first-child {
    border-top-left-radius: ${theme.borderRadius.md};
  }
  &:last-child {
    border-top-right-radius: ${theme.borderRadius.md};
  }
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
  width: ${({ theme }) => theme.spacing[20]};
  height: auto;
  border-radius: ${theme.borderRadius.sm};
  object-fit: contain;
`;

const ExerciseName = styled.div`
  font-weight: ${theme.fontWeights.medium};
  margin-top: ${theme.spacing[1]};
  color: ${theme.colors.black};
`;

const Routine = () => {
  const workoutData = [
    {
      image: '/public/img/DBPress.png',
      name: '덤벨 프레스',
      part: '윗가슴, 삼두',
      equipment: '덤벨,벤치',
      weight: '5-15kg',
      reps: '6회',
      sets: '4세트',
    },
    {
      image: '/public/img/inclineDP.png',
      name: '인클라인 덤벨 프레스',
      part: '밑가슴, 삼두',
      equipment: '벤치,덤벨',
      weight: '5-10kg',
      reps: '6-12회',
      sets: '4세트',
    },
    {
      image: '/public/img/DBFly.png',
      name: '덤벨 플라이',
      part: '윗가슴, 삼두',
      equipment: '벤치,덤벨',
      weight: '2.5kg',
      reps: '12-18회',
      sets: '4세트',
    },
    {
      image: '/public/img/DBRow.png',
      name: '덤벨 로우',
      part: '광배근,승모근',
      equipment: '바벨',
      weight: '5-10kg',
      reps: '6-12회',
      sets: '4세트',
    },
    {
      image: '/public/img/PushUp.png',
      name: '푸쉬업',
      part: '가슴전체, 삼두',
      equipment: 'X',
      weight: '체중',
      reps: '20회',
      sets: '3세트',
    },
    {
      image: '/public/img/PullUp.png',
      name: '풀업',
      part: '광배근, 이두',
      equipment: '풀업바,벤딩',
      weight: '체중',
      reps: '5-10회',
      sets: '3세트',
    },
  ];

  return (
    <PageContainer>
      <Title>근육량 증진 루틴</Title>
      <CategoryContainer>
        <Category>가슴, 등</Category>
        <Category>허리, 어깨</Category>
        <Category>하체, 팔</Category>
      </CategoryContainer>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>운동</TableHeader>
            <TableHeader>부위</TableHeader>
            <TableHeader>장비</TableHeader>
            <TableHeader>무게</TableHeader>
            <TableHeader>횟수</TableHeader>
            <TableHeader>세트</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {workoutData.map((exercise, index) => (
            <TableRow key={index}>
              <TableCell className="image-cell">
                <ExerciseImage src={exercise.image} alt={exercise.name} />
                <ExerciseName>{exercise.name}</ExerciseName>
              </TableCell>
              <TableCell>{exercise.part}</TableCell>
              <TableCell>{exercise.equipment}</TableCell>
              <TableCell>{exercise.weight}</TableCell>
              <TableCell>{exercise.reps}</TableCell>
              <TableCell>{exercise.sets}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default Routine;
