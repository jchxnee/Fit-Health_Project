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
    height: 500px;
    

    iframe {
        width: ${({ theme }) => theme.width.lg};
        height: 500px;
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
  '체형교정·가벼운통증': 'https://www.youtube.com/embed/NO1mncOrbdI?si=LBxNkxzr-_egOba2',
  '헬스': 'https://www.youtube.com/embed/_buwjp1ogAQ?si=lUF81j70vEfNTfPK',
  '다이어트': 'https://www.youtube.com/embed/CYcLODSeC-c?si=lVohpAnbdqWvcSHf',
  '근력향상': 'https://www.youtube.com/embed/w0WQHVYKsss?si=SpWoaZGHBLd4olNv',
  '산전·후운동': 'https://www.youtube.com/embed/zDcOqeLGymE?si=_WgS29ftGimrXeVq',
  '만성통증·재활운동': 'https://www.youtube.com/embed/dismp4Vw7UQ?si=AvVzLej5Z6Jkec4W',
  '요가명상': 'https://www.youtube.com/embed/HtHS8oO9Tg8?si=b4g5jPe8KRj1cQjp',
  '근골격계 케어': 'https://www.youtube.com/embed/pdKENkJjWkc?si=lU5AgVWs9BSHq4P4',
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
