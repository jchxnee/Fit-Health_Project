import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]} 0;
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
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  background: ${({theme}) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;
const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm };
  color: ${({ theme }) => theme.colors.primary};
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