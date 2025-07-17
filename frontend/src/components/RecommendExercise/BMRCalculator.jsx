import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useUserStore from '../../store/useUserStore';

const BMRCalcWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  margin: 0 auto;
`;
const Title = styled.div`
  background: ${({ theme }) => theme.colors.gray[100]};
  width: 100%;
  max-width: 700px;
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;
const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;
  margin-bottom: 20px;
  margin-top: 15px;
`;

const GenderRadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;
`;

const RadioLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  &:checked {
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Input = styled.input`
  width: 120px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
`;

const Select = styled.select`
  width: 120px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-right: ${({ theme }) => theme.spacing[3]};
  outline: none;
`;

const Result = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Span = styled.span`
  display: block;
`;

function BMRCalculator({ setUserData }) {
  const { user } = useUserStore();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weeklyExerciseFrequency, setWeeklyExerciseFrequency] = useState('');
  const name = user.name;

  const [calculatedBMR, setCalculatedBMR] = useState('');

  useEffect(() => {
    let bmrResult = '';
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (h > 0 && w > 0 && a > 0 && (gender === 'male' || gender === 'female')) {
      if (gender === 'male') {
        bmrResult = (10 * w + 6.25 * h - 5 * a + 5).toFixed(0);
      } else if (gender === 'female') {
        bmrResult = (10 * w + 6.25 * h - 5 * a - 161).toFixed(0);
      }
    }
    setCalculatedBMR(bmrResult);

    if (setUserData) {
      setUserData({
        name: name,
        height: h,
        weight: w,
        age: a,
        gender: gender,
        weeklyExerciseFrequency: parseInt(weeklyExerciseFrequency),
        bmr: bmrResult ? parseFloat(bmrResult) : null,
      });
    }
  }, [height, weight, age, gender, weeklyExerciseFrequency, name, setUserData]);

  return (
    <BMRCalcWrapper>
      <Title>기초대사량(BMR) 계산기</Title>
      <InputRow>
        {' '}
        <GenderRadioGroup>
          <Span>성별</Span>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
            />
            남성
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
            />
            여성
          </RadioLabel>
        </GenderRadioGroup>
      </InputRow>
      <InputRow>
        <Span>키</Span>
        <Input type="number" placeholder="cm" value={height} onChange={(e) => setHeight(e.target.value)} />
        <Span>몸무게</Span>
        <Input type="number" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Span>나이</Span>
        <Input type="number" placeholder="세" value={age} onChange={(e) => setAge(e.target.value)} />
      </InputRow>

      <Result>
        {calculatedBMR ? (
          `${name}님의 기초대사량은 ${calculatedBMR} kcal 입니다.`
        ) : (
          <>
            <Span>성별, 키, 몸무게, 나이를 입력하시면 기초대사량을 알 수 있습니다.</Span>
            <Span>식단 추천을 위해 주 운동 횟수도 입력해주세요.</Span>
          </>
        )}
      </Result>
      <InputRow>
        {' '}
        <Span>주 운동 횟수</Span>
        <Select value={weeklyExerciseFrequency} onChange={(e) => setWeeklyExerciseFrequency(e.target.value)}>
          <option value="">선택</option>
          {[...Array(8).keys()].map((num) => (
            <option key={num} value={num}>
              {num}회
            </option>
          ))}
        </Select>
      </InputRow>
    </BMRCalcWrapper>
  );
}

export default BMRCalculator;
