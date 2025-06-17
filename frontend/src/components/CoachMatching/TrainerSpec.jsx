import React from 'react';
import styled from 'styled-components';
import { FaTrophy } from 'react-icons/fa';
import theme from '../../styles/theme';

const QualificationsContainer = styled.div`
  width: ${theme.width.lg};
  max-width: 100%;
  margin: ${theme.spacing[8]} auto;
  padding: ${theme.spacing[6]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
`;

const QualificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[800]};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xl};
  flex-shrink: 0;
  padding-bottom: 10px;
`;

const TrainerQualifications = ({ qualifications }) => {
  return (
    <QualificationsContainer>
      {qualifications.map((q, index) => (
        <QualificationItem key={index}>
          <IconWrapper>🏆</IconWrapper>
          <span>{q.text}</span>
        </QualificationItem>
      ))}
    </QualificationsContainer>
  );
};

export default TrainerQualifications;
