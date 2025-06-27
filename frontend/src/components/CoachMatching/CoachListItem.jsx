import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import basicProfile from '../../../public/img/basicProfile.jpg';

const CoachCard = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.white};
  width: 100%;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
`;

const ProfileImage = styled.img`
  width: ${({ theme }) => theme.spacing[16]};
  height: ${({ theme }) => theme.spacing[16]};
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  margin-right: ${theme.spacing[4]};
`;

const CoachInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const NameAndSpecialization = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spacing[5]};
`;

const Name = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.black};
  margin-right: ${theme.spacing[2]};
`;

const Specialization = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[700]};
  white-space: nowrap;
`;

const Location = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray[500]};
  margin-top: ${theme.spacing[0.5]};
  display: flex;
  align-items: center;

  &::before {
    content: '📍';
    margin-right: ${theme.spacing[0.5]};
  }
`;

const Ratings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: ${theme.spacing[4]};
`;

const StarRating = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.warning};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;

  &::before {
    content: '⭐';
    margin-right: ${theme.spacing[0.5]};
  }
`;

const ReviewCount = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray[500]};
  margin-top: ${theme.spacing[0.5]};
`;

const CoachListItem = ({ coach }) => {
  return (
    <CoachCard>
      <ProfileImage src={coach.img ? coach.img : basicProfile} alt="프로필 이미지" />
      <CoachInfo>
        <NameAndSpecialization>
          <Name>{coach.name} 트레이너</Name>
          <Specialization>{coach.specialization}</Specialization>
          <Location>{coach.location}</Location>
        </NameAndSpecialization>
      </CoachInfo>
      <Ratings>
        <StarRating>{coach.rating.toFixed(1)}</StarRating>
        <ReviewCount>후기 ({coach.reviews})</ReviewCount>
      </Ratings>
    </CoachCard>
  );
};

export default CoachListItem;
