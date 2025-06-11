import React, { useState } from 'react';
import styled from 'styled-components';

const BMICalcWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  background: #eee;
  border-radius: 10px;
  padding: 32px 32px 24px 32px;
  margin: 0 auto 32px auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const Title = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: 22px;
  font-weight: 500;
  color: #444;
  margin-bottom: 8px;
`;
const InputRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;
const Input = styled.input`
  width: 120px;
  padding: 10px 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
`;
const Result = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: 20px;
  color: #222;
  margin-top: 10px;
`;

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const name = 'OO';
    let bmi = '';
    if (height && weight) {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            bmi = (w / (h * h)).toFixed(1);
        }
    }
    return (
        <BMICalcWrapper>
            <Title>BMI 계산기</Title>
            <InputRow>
                <span>키</span>
                <Input
                    type="number"
                    placeholder="cm"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                />
                <span>몸무게</span>
                <Input
                    type="number"
                    placeholder="kg"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                />
            </InputRow>
            <Result>
                {height && weight
                    ? `${name}님의 BMI지수는 ${bmi} 입니다.`
                    : '키와 몸무게를 입력하세요.'}
            </Result>
        </BMICalcWrapper>
    );
};

export default BMICalculator;
