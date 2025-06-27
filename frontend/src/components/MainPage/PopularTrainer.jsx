import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import basicProfile from '../../../public/img/basicProfile.jpg';

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
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
  object-position: center;
  border-radius: ${({ theme }) => `${theme.borderRadius['2xl']} ${theme.borderRadius['2xl']} 0 0`};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Name = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`;

const PopularTrainer = ({ trainers }) => (
  <Wrapper>
    <Container>
      <TitleRow>
        <Title>이 달의 인기 트레이너</Title>
        <NavItem to="/coachList">
          <ViewAll>전체보기</ViewAll>
        </NavItem>
      </TitleRow>
      <List>
        {trainers && trainers.length > 0 ? (
          <List>
            {trainers.map((t) => (
              <Link key={t.trainer_no} to={`/coach/${t.trainer_no}`} style={{ textDecoration: 'none' }}>
                <TrainerCard>
                  <ProfileImg src={t.profile_image ? t.profile_image : basicProfile} alt={t.trainer_name} />
                  <Name>{t.trainer_name} 트레이너</Name>
                </TrainerCard>
              </Link>
            ))}
          </List>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#999' }}>인기 트레이너가 없습니다.</div>
        )}
      </List>
    </Container>
  </Wrapper>
);

export default PopularTrainer;
