import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[10]} 0`};
`;
const Container = styled.div`
  width: ${({ theme }) => theme.width.lg};
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;
const Title = styled.h2`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
`;

const NavItem = styled(Link)`
  outline: none;
`;
const ViewAll = styled.span`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;
const List = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[10]};
  justify-content: center;
`;
const TrainerCard = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  justify-content: center;
`;
const ProfileImg = styled.div`
  width: 100%;
  height: 80%;
  background: ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => `${theme.borderRadius['2xl']} ${theme.borderRadius['2xl']} 0 0`};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;
const Name = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`;

const trainers = [{ name: '김순자 트레이너' }, { name: '정나미 트레이너' }, { name: '고훈 트레이너' }];

const PopularTrainer = () => (
  <Wrapper>
    <Container>
      <TitleRow>
        <Title>이 달의 인기 트레이너</Title>
        <NavItem to="/coachList">
          <ViewAll>전체보기</ViewAll>
        </NavItem>
      </TitleRow>
      <List>
        {trainers.map((t) => (
          <TrainerCard key={t.name}>
            <ProfileImg />
            <Name>{t.name}</Name>
          </TrainerCard>
        ))}
      </List>
    </Container>
  </Wrapper>
);

export default PopularTrainer;
