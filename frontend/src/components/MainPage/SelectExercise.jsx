import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import media from '../../utils/media';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]} 0;

  ${media.md`
    padding: ${({ theme }) => theme.spacing[6]} 0;
  `}
`;

const List = styled.div`
  display: flex;
  gap: 110px; // 기존 간격
  flex-wrap: wrap; // 항목이 많아지면 줄 바꿈
  justify-content: center; // 항목 중앙 정렬
  max-width: ${({ theme }) => theme.width.lg}; // 최대 너비 제한

  ${media.lg`
    gap: ${({ theme }) => theme.spacing[8]}; // 데스크톱 미만에서 간격 줄이기
    padding: 0 ${({ theme }) => theme.spacing[4]};
  `}
  ${media.md`
    gap: ${({ theme }) => theme.spacing[6]}; // 태블릿에서 간격 더 줄이기
  `}
  ${media.sm`
    gap: ${({ theme }) => theme.spacing[4]}; // 모바일에서 간격 최소화
    padding: 0 ${({ theme }) => theme.spacing[2]};
  `}
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
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.md`
    width: ${({ theme }) => theme.spacing[8]};
    height: ${({ theme }) => theme.spacing[8]};
  `}
  ${media.sm`
    width: ${({ theme }) => theme.spacing[6]};
    height: ${({ theme }) => theme.spacing[6]};
  `}
`;

const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;

const NavItem = styled(Link)`
  outline: none;
`;

const items = [
  { label: '전체보기', img: 'src/assets/MainPage/All.png' },
  { label: '헬스', img: 'src/assets/MainPage/health.png' },
  { label: '요가', img: 'src/assets/MainPage/yoga.png' },
  { label: '도수', img: 'src/assets/MainPage/therapy.png' },
  { label: '재활', img: 'src/assets/MainPage/rehabilitation.png' },
];

const SelectExercise = () => (
  <Wrapper>
    <List>
      {items.map((item) => (
        <NavItem to="/coachList" state={{ category: item.label }} key={item.label}>
          <Item key={item.label}>
            <IconBox>{item.img && <IconImage src={item.img} alt={item.label} />}</IconBox>
            <Label>{item.label}</Label>
          </Item>
        </NavItem>
      ))}
    </List>
  </Wrapper>
);

export default SelectExercise;
