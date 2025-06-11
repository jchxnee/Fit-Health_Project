import styled from 'styled-components';

const ButtonStyle = styled.button`
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
  align-items: center;
  width: ${({ theme }) => (theme.fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.9;
  }
`;

export default ButtonStyle;
