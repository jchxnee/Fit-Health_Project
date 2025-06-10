import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  padding: 38px 0;
`;
const List = styled.div`
  display: flex;
  gap: 110px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;
const IconBox = styled.div`
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 10px;
  margin-bottom: 8px;
`;
const Label = styled.span`
  font-family: 'SUITE', sans-serif;
  font-size: 14px;
  color: #3D4149;
`;

const items = [
    { label: '전체보기' },
    { label: '헬스' },
    { label: '요가' },
    { label: '도수' },
    { label: '재활' },
];

const SelectExercise = () => (
    <Wrapper>
        <List>
            {items.map((item) => (
                <Item key={item.label}>
                    <IconBox />
                    <Label>{item.label}</Label>
                </Item>
            ))}
        </List>
    </Wrapper>
);

export default SelectExercise;