import React, { useRef } from 'react';
import styled from 'styled-components';
import heroImage from '/public/img/introduce.jpg';

const CompanyIntroducionPage = () => {
  const introductionSectionRef = useRef(null); // 소개 섹션으로 스크롤하기 위한 ref
  const scrollToIntroduction = () => {
    introductionSectionRef.current.scrollIntoView({
      behavior: 'smooth', // 부드러운 스크롤
      block: 'start', // 요소의 시작 부분이 뷰포트 상단에 맞춰지도록
    });
  };
  return (
    <LandingPageContainer>
      {/* 히어로 섹션: 페이지 상단의 메인 비주얼 및 핵심 메시지 영역 */}
      <HeroSection style={{ backgroundImage: `url(${heroImage})` }}>
        <HeroTextContainer>
          <HeroSubtitle>No excuses. Just results.</HeroSubtitle>
          <HeroTitle>건강은 장소를 가리지 않습니다.</HeroTitle>
          <HeroButtonsContainer>
            {/* 'FIT-HEALTH 알아보기' 버튼: 클릭 시 소개 섹션으로 스크롤 */}
            <HeroButton $isPrimary={false} onClick={scrollToIntroduction}>
              FIT-HEALTH 알아보기 &gt;
            </HeroButton>{' '}
            <HeroButton $isPrimary={true}>핏코치 매칭 신청 &gt;</HeroButton>
          </HeroButtonsContainer>
        </HeroTextContainer>
      </HeroSection>

      {/* 소개 섹션: FIT-HEALTH 플랫폼의 개요와 장점을 설명하는 부분 */}
      <IntroductionSection ref={introductionSectionRef}>
        <SectionTitle>
          건강을 위한 가장 똑똑한 선택 <br />
          <span>FIT-HEALTH</span>
        </SectionTitle>
        <IntroductionText>
          FIT:HEALTH는 건강 목표 설정부터 맞춤 핏코치 매칭, 1:1 운동 상담, 건강데이터 수집 등을 서비스하며 <br />
          여러분의 건강 여정을 통합적으로 지원하는 스마트 헬스케어 플랫폼입니다.
        </IntroductionText>
        <IntroFeatureContainer>
          <IntroFeatureItem>
            <IntroFeatureIcon>💪</IntroFeatureIcon>
            나에게 딱 맞는 전문 코치 매칭
          </IntroFeatureItem>
          <IntroFeatureItem>
            비대면 1:1 채팅으로 실시간 상담
            <IntroFeatureIcon>💬</IntroFeatureIcon>
          </IntroFeatureItem>
          <IntroFeatureItem>
            <IntroFeatureIcon>📋</IntroFeatureIcon>
            나만의 운동 프로그램 추천받기
          </IntroFeatureItem>
          <IntroFeatureItem>
            전문성과 편리함, 맞춤형 건강관리의 기준. <br />
            이제 건강은 혼자가 아닌 함께 관리하세요.
          </IntroFeatureItem>
        </IntroFeatureContainer>
      </IntroductionSection>

      {/* 특징 섹션: 제공하는 서비스의 세부 종류(헬스, 요가, 도수, 재활)를 소개하는 부분 */}
      <FeatureSection>
        <SectionTitle>전문가와 함께하세요</SectionTitle>
        <FeatureGrid>
          <FeatureItem>
            <FeatureImage src="" alt="헬스 이미지" />
            <FeatureTitle>헬스</FeatureTitle>
            <FeatureDescription>
              운동을 처음하시나요?
              <br />
              언제 어디서든 전문성을 갖춘 트레이너와 <br />
              함께해보세요.
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureImage src="" alt="요가 이미지" />
            <FeatureTitle>요가</FeatureTitle>
            <FeatureDescription>
              바쁜 일상과 출장 중에도 나만의 시간은 필요합니다.
              <br />
              전문 요가 강사와 함께하는 실시간 1:1 세션으로, <br />
              어디서든 몸과 마음의 균형을 회복하세요.
              <br />
              공간이 좁아도, 요가 매트 하나만 있으면 충분합니다.
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureImage src="" alt="도수 이미지" />
            <FeatureTitle>도수</FeatureTitle>
            <FeatureDescription>
              장시간 여행과 낯선 숙소에서 쌓인 피로와 <br />
              긴장을 풀어드립니다.
              <br />
              국가자격 보유 도수 전문가의 온라인 맞춤 스트레칭 <br />
              프로그램으로, 목·어깨·허리 통증까지 전문적으로 <br />
              관리받으세요.
            </FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureImage src="" alt="재활 이미지" />
            <FeatureTitle>재활</FeatureTitle>
            <FeatureDescription>
              부상 회복 중인 분들을 위한 섬세한 운동 설계.
              <br />
              물리치료 기반의 재활 운동 프로그램은 회복 상태, <br />
              통증 부위, 움직임 제한 등을 고려해 1:1로 진행됩니다.
              <br />
              출장 중에도 치료 흐름이 끊기지 않도록 도와드립니다.
            </FeatureDescription>
          </FeatureItem>
        </FeatureGrid>
      </FeatureSection>
    </LandingPageContainer>
  );
};

export default CompanyIntroducionPage;

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.white};
`;

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['8']};
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
`;

const HeroTextContainer = styled.div`
  max-width: 600px;
  z-index: 2;
  position: absolute;
  top: 28%;
  right: 0;
  transform: translateX(-50%);
  text-align: left;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.thin};
  line-height: 1.6;
  margin-bottom: 0;
`;

const HeroButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-top: ${({ theme }) => theme.spacing['8']};
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const HeroButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['6']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IntroductionSection = styled.section`
  padding: ${({ theme }) => theme.spacing['16']} 0;
  text-align: center;
  max-width: ${({ theme }) => theme.width.lg};
  width: 90%;
`;

const IntroFeatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${({ theme }) => theme.width.lg};
  margin-top: ${({ theme }) => theme.spacing['24']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  padding: 0 ${({ theme }) => theme.spacing['4']};
`;

const IntroFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
  width: 100%;
  justify-content: flex-start;

  &:nth-child(even) {
    justify-content: flex-end;
  }

  &:last-child {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    text-align: right;
    margin-top: ${({ theme }) => theme.spacing['4']};
    justify-content: flex-end;
    line-height: 1.6;
  }
`;

const IntroFeatureIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  line-height: 1;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  text-align: center;

  & > span {
    position: relative;
    display: inline-block;
  }

  & > span::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const IntroductionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
`;

const FeatureSection = styled.section`
  padding: ${({ theme }) => theme.spacing['20']} 0;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FeatureGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing['8']};
  max-width: ${({ theme }) => theme.width.lg};
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing['4']};
`;

const FeatureItem = styled.div`
  width: 450px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  padding: ${({ theme }) => theme.spacing['2']};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.6;
  margin-bottom: 0;
`;
