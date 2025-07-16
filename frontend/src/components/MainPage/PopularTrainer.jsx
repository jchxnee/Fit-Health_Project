import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import basicProfile from '../../../public/img/basicProfile.jpg';
import { BeatLoader } from 'react-spinners';
import media from '../../utils/media'; // media 헬퍼 함수 임포트

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => `${theme.spacing[10]} 0`};

  ${media.md`
    margin: ${({ theme }) => `${theme.spacing[6]} 0`};
  `}
`;

const Container = styled.div`
  width: ${({ theme }) => theme.width.lg};
  padding: 0 ${({ theme }) => theme.spacing[4]}; // 좌우 패딩 추가
  box-sizing: border-box; // 패딩 포함 너비 계산

  ${media.lg`
    width: 90%; // 더 작은 화면에서 너비 조정
  `}
  ${media.md`
    width: 95%;
  `}
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  ${media.md`
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  `}
`;

const Title = styled.h2`
  font-family: 'SUITE', sans-serif;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.xl};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
`;

const NavItem = styled(Link)`
  outline: none;
`;

const ViewAll = styled.span`
  font-family: 'SUITE', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
`;

const List = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[10]};
  justify-content: center;
  flex-wrap: wrap; // 항목이 많아지면 줄 바꿈

  ${media.lg`
    gap: ${({ theme }) => theme.spacing[8]};
  `}
  ${media.md`
    gap: ${({ theme }) => theme.spacing[6]};
  `}
  ${media.sm`
    gap: ${({ theme }) => theme.spacing[4]};
    justify-content: space-around; // 모바일에서 공간 고르게 분배
  `}
`;

const TrainerCard = styled.div`
  width: 250px; // 기본 너비
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

  ${media.md`
    width: 200px;
    height: 200px;
  `}
  ${media.sm`
    width: 150px;
    height: 150px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  `}
  ${media.xs`
    width: 120px;
    height: 120px;
  `}
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
  object-position: center;
  border-radius: ${({ theme }) => `${theme.borderRadius['2xl']} ${theme.borderRadius['2xl']} 0 0`};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  ${media.sm`
    border-radius: ${({ theme }) => `${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0`};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  `}
`;

const Name = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

const PopularTrainer = ({ trainers, isLoading }) => (
  <Wrapper>
    <Container>
      <TitleRow>
        <Title>이 달의 인기 트레이너</Title>
        <NavItem to="/coachList">
          <ViewAll>전체보기</ViewAll>
        </NavItem>
      </TitleRow>
      <List>
        {isLoading ? (
          <LoaderWrapper>
            <BeatLoader color="#d1d5db" />
          </LoaderWrapper>
        ) : trainers && trainers.length > 0 ? (
          trainers.map((t) => (
            <Link key={t.trainer_no} to={`/coach/${t.trainer_no}`} style={{ textDecoration: 'none' }}>
              <TrainerCard>
                <ProfileImg
                  src={t.profile_image ? `${CLOUDFRONT_URL}${t.profile_image}?v=${Date.now()}` : basicProfile}
                  alt={t.trainer_name}
                />
                <Name>{t.trainer_name} 트레이너</Name>
              </TrainerCard>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#999' }}>인기 트레이너가 없습니다.</div>
        )}
      </List>
    </Container>
  </Wrapper>
);

export default PopularTrainer;
