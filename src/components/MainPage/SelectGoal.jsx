import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24px 0;
`;

const Button = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
`;

const List = styled.div`
  width: 674px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CategoryBtn = styled.button`
  min-width: 74px;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ selected, theme }) => (selected ? theme.colors.secondary : 'transparent')};
  color: ${({ selected, theme }) => (selected ? theme.colors.white : theme.colors.primary)};
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  outline: none;
  box-shadow: none;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const VideoWrapper = styled.div`
  margin-top: 32px;
  width: 720px;
  height: 405px;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius['xl']};
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

const categoryVideos = {
  '체형교정·가벼운통증': 'https://www.youtube.com/embed/UItWltVZZmE',
  '헬스': 'https://www.youtube.com/embed/2tM1LFFxeKg',
  '다이어트': 'https://www.youtube.com/embed/FXpIoQ_rT_c',
  '근력향상': 'https://www.youtube.com/embed/gMaB-fG4u4g',
  '산전·후운동': 'https://www.youtube.com/embed/HB3fK7rHUYM',
  '만성통증·재활운동': 'https://www.youtube.com/embed/RAZ5FhJvQ2U',
  '요가명상': 'https://www.youtube.com/embed/v7AYKMP6rOE',
  '근골격계 케어': 'https://www.youtube.com/embed/M6L-nZGIUTE',
};

const SelectGoal = () => {
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

        <VideoWrapper>
          <iframe
              title={selected}
              src={categoryVideos[selected]}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
          />
        </VideoWrapper>
      </Wrapper>
  );
};

export default SelectGoal;
