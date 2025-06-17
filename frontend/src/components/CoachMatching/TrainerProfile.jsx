import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaRegEnvelope } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import theme from '../../styles/theme';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const ProfileCard = styled.div`
  display: flex;
  align-items: flex-start;
  width: ${theme.width.lg};
  max-width: 100%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing[6]} ${theme.spacing[8]};
  margin: ${theme.spacing[10]} auto ${theme.spacing[6]} auto;
  gap: ${theme.spacing[8]};
`;

const ProfileImageWrapper = styled.div`
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${theme.colors.gray[100]};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.colors.gray[200]};
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const NameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[2]};
`;

const NameAndSNS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TrainerName = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing['4']};
`;

const SocialMediaLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing['4']};
`;

const SocialLink = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Specialty = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.primary};
  flex-shrink: 0;
  margin-right: 15px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing[3]};
  gap: ${theme.spacing.xs};
  justify-content: flex-start;
  margin-left: auto;
  width: auto;
`;

const Introduction = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.gray[700]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[4]};
  white-space: pre-line;
  text-align: left;
`;

const ApplyButton = styled.button`
  background-color: ${theme.colors.button};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
  align-self: flex-end;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.colors.primaryDark};
    opacity: 90%;
  }
`;

const StyledKakaoIcon = styled(RiKakaoTalkFill)`
  background-color: #ffeb00;
  color: #191919;
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  user-select: none;
  border-radius: 50%;
  padding: 2px;
`;

const StyledInstagramIcon = styled(FaInstagram)`
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  color: white;
  border-radius: 4px;
  padding: 2px;
`;

const NavItem = styled(Link)`
  width: 110px;
  outline: none;
`;
const BackDiv = styled.div`
  display: flex;
  justify-content: end;
`;

const TrainerProfile = ({ trainer }) => {
  return (
    <ProfileCard>
      <ProfileImageWrapper>
        {trainer.imageUrl ? (
          <ProfileImage src={trainer.imageUrl} alt={`${trainer.name} 트레이너`} />
        ) : (
          <FaRegEnvelope size="4em" color={theme.colors.gray[300]} />
        )}
      </ProfileImageWrapper>
      <ProfileInfo>
        <NameRow>
          <NameAndSNS>
            <TrainerName>{trainer.name} 트레이너</TrainerName>
            <SocialMediaLinks>
              {trainer.kakaoId && (
                <SocialLink>
                  <StyledKakaoIcon size={16} />
                  {trainer.kakaoId}
                </SocialLink>
              )}
              {trainer.instagramId && (
                <SocialLink>
                  <StyledInstagramIcon size={16} />@{trainer.instagramId}
                </SocialLink>
              )}
            </SocialMediaLinks>
          </NameAndSNS>
          <Specialty>{trainer.specialty}</Specialty>
        </NameRow>
        <Location>
          <FaMapMarkerAlt size={14} />
          {trainer.location}
        </Location>
        <Introduction>{trainer.introduction}</Introduction>
        <BackDiv>
          <NavItem to="/coachMatching">
            <ApplyButton>신청하기</ApplyButton>
          </NavItem>
        </BackDiv>
      </ProfileInfo>
    </ProfileCard>
  );
};

export default TrainerProfile;
