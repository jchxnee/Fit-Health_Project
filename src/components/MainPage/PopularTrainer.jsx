import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  margin: 40px 0;
`;
const Container = styled.div`
  width: 1008px;
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const Title = styled.h2`
  font-family: 'SUITE', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: #3D4149;
`;
const ViewAll = styled.span`
  font-family: 'SUITE', sans-serif;
  font-size: 18px;
  color: #3D4149;
  cursor: pointer;
`;
const List = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
`;
const TrainerCard = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f5;
  border-radius: 15px;
  justify-content: center;
`;
const ProfileImg = styled.div`
  width: 100%;
  height: 80%;
  background: #ddd;
  border-radius: 15px 15px 0 0;
  margin-bottom: 16px;
`;
const Name = styled.div`
  font-family: 'SUITE', sans-serif;
  font-size: 20px;
  color: #3D4149;
`;

const trainers = [
    { name: '김순자 트레이너' },
    { name: '정나미 트레이너' },
    { name: '고훈 트레이너' },
];

const PopularTrainer = () => (
    <Wrapper>
        <Container>
            <TitleRow>
                <Title>이 달의 인기 트레이너</Title>
                <ViewAll>전체보기</ViewAll>
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