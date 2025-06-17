import React from 'react';
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
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const trainers = [
  { name: '김순자 트레이너', imageUrl: '/public/img/chest.png' },
  { name: '정나미 트레이너', imageUrl: '/public/img/trainer2.jpg' },
  { name: '고훈 트레이너', imageUrl: '/public/img/trainer3.jpg' },
  { name: '김현아 트레이너', imageUrl: '/public/img/trainer4.jpg' },
];

const TrainerPhoto = () => (
  <Wrapper>
    <Container>
      <TitleRow>
        <Title>트레이너 사진</Title>
      </TitleRow>
      <List>
        {trainers.map((t) => (
          <TrainerCard key={t.name}>
            <PhotoImg src={t.imageUrl} alt={t.name} />
          </TrainerCard>
        ))}
      </List>
    </Container>
  </Wrapper>
);

export default TrainerPhoto;
