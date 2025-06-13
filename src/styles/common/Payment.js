import styled from 'styled-components';
import ButtonStyle from './Button';
import { Link } from 'react-router-dom';

export const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

export const PaymentContentBox = styled.div`
  width: 100%;
  max-width: 1008px;
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const SectionTitle = styled.h2`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const InfoStackedRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[2]} 0;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;

  &:last-of-type {
    border-bottom: none;
  }

  &.horizontal-start {
    justify-content: flex-start;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const InfoKey = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0;
`;

export const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ $highlighted, theme }) => ($highlighted ? theme.fontWeights.bold : theme.fontWeights.regular)};
  color: ${({ $isRed, theme }) => ($isRed ? theme.colors.danger : theme.colors.primary)};
`;

export const PaymentAmountSection = styled.div``;

export const TotalAmountRow = styled(InfoRow)`
  padding: ${({ theme }) => theme.spacing[4]} 0;
  margin-top: ${({ theme }) => theme.spacing[4]};
  justify-content: space-between;
`;

export const TotalAmountKey = styled(InfoKey)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const TotalAmountValue = styled(InfoValue)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.danger};
`;

export const PaymentButton = styled(Link)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[32]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  align-items: center;
  width: ${({ theme }) => (theme.fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.9;
  }
`;
