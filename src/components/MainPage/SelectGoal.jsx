import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 130px 0 24px 0;
`;

const Button = styled.div`
  width: 1008px;
  display: flex;
`;
const List = styled.div`
  width: 674px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  gap: 16px;
`;
const CategoryBtn = styled.button`
  min-width: 74px;
  height: 45px;
  padding: 10px;

  border-radius: 24px;
  border: 1.5px solid #cdcdcd;
  background: ${({ selected }) => (selected ? '#3D6EFF' : 'transparent')};
  color: ${({ selected }) => (selected ? '#fff' : `${({ theme }) => theme.colors.primary}`)};
  font-family: 'SUITE', sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  outline: none;
  box-shadow: none;
  &:hover {
    background: #3d6eff;
    color: #fff;
  }
`;

const categories = [
  '체형교정·가벼운통증',
  '헬스',
  '다이어트',
  '근력향상',
  '산전·후운동',
  '만성통증·재활운동',
  '요가명상',
  '근골격계 케어',
];

const SelectExercise = () => {
  const [selected, setSelected] = useState('근력향상');
  return (
    <Wrapper>
      <Button>
        <List>
          {categories.map((cat) => (
            <CategoryBtn key={cat} selected={selected === cat} onClick={() => setSelected(cat)}>
              {cat}
            </CategoryBtn>
          ))}
        </List>
      </Button>
    </Wrapper>
  );
};

export default SelectExercise;
