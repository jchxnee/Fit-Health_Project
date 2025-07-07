import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useUserStore from '../../store/useUserStore';

const BMICalcWrapper = styled.div`
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
`;
const Input = styled.input`
  width: 120px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
`;
const Result = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

function BMICalculator({ bmi, setBmi }) {
  const { user } = useUserStore();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const name = user.name;
  let calcBmi = '';
  if (height && weight) {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      calcBmi = (w / (h * h)).toFixed(1);
    }
  }
  useEffect(() => {
    setBmi(calcBmi);
  }, [calcBmi, setBmi]);

  return (
    <BMICalcWrapper>
      <Title>BMI 계산기</Title>
      <InputRow>
        <span>키</span>
        <Input type="number" placeholder="cm" value={height} onChange={(e) => setHeight(e.target.value)} />
        <span>몸무게</span>
        <Input type="number" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </InputRow>
      <Result>{height && weight ? `${name}님의 BMI지수는 ${calcBmi} 입니다.` : '키와 몸무게를 입력하세요.'}</Result>
    </BMICalcWrapper>
  );
}

export default BMICalculator;
