import React from 'react';
import styled from 'styled-components';
import { FaListUl } from 'react-icons/fa';
import { PiCalendar } from 'react-icons/pi';

const StyledButtonsContainer = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing['1']};
  background-color: ${({ theme }) => theme.colors.gray['100']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing['1']};
`;

const StyledIconButton = styled.button`
  background-color: transparent;
  border: none;
  padding: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover,
  &:active,
  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  & > svg {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.gray['700']};
  }
`;

const StyledCalendarIcon = styled(StyledIconButton)`
  padding: ${({ theme }) => theme.spacing['2']};

  & > svg {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  }
`;

const CoachSubBar = () => {
  return (
    <StyledButtonsContainer>
      <StyledIconButton>
        <FaListUl />
      </StyledIconButton>
      <StyledCalendarIcon>
        <PiCalendar />
      </StyledCalendarIcon>
    </StyledButtonsContainer>
  );
};

export default CoachSubBar;
