import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  max-width: 1008px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[10]} 0`};
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  width: 100%;
  max-width: 1008px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;
const Title = styled.h2`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
`;

const List = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[10]};
  justify-content: center;
`;
const TrainerCard = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  justify-content: center;
    gap: ${({ theme }) => theme.spacing[3]};
`;
const ProfileImg = styled.div`
  width: ${({ theme }) => theme.spacing[40]};
  height: ${({ theme }) => theme.spacing[40]};
  background: ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => `${theme.borderRadius['2xl']}`};
  background-image: ${({ img }) => img ? `url(${img})` : 'none'};
  background-size: cover;
  background-position: center;
`;
const Name = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`;

const defaultTrainers = [
    { name: '다이어트' },
    { name: '근육량 증진', trainer: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/516/1b86bf91cd093359045a07c31fc7f9d9_res.jpeg' },
    { name: '홈트' },
];

const Routine = ({ trainers = defaultTrainers, title = '추천 트레이너' }) => (
    <Wrapper>
        <Container>
            <TitleRow>
                <Title>{title}</Title>
            </TitleRow>
            <List>
                {trainers.map((t) => (
                    <TrainerCard key={t.name}>
                        <ProfileImg img={t.trainer}/>
                        <Name>{t.name} 루틴</Name>
                    </TrainerCard>
                ))}
            </List>
        </Container>
    </Wrapper>
);

export default Routine;