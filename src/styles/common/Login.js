import styled from 'styled-components';
import ButtonStyle from './Button';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing[20]}; /* 80px from theme.spacing */
  background-color: #fdfafa; /* Light background */
  width: 100%;
  box-sizing: border-box;
`;

export const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']}; /* 24px */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[8]}; /* 32px */
  color: ${({ theme }) => theme.colors.primary};
`;

export const LoginFormBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]}; /* 40px */
  border-radius: ${({ theme }) => theme.borderRadius.base}; /* 8px */
  box-shadow: ${({ theme }) => theme.shadows.base};
  width: 100%;
  max-width: 534px; /* Max width for the login form area */
  height: 565px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]}; /* 20px */
  width: 400px;
  /* InputGroup 자체에는 position: relative;가 필요하지 않습니다. */
`;

export const StyledLabel = styled.label`
  display: block; /* 라벨을 블록 요소로 만들어 인풋 위에 위치시키고 왼쪽 정렬 */
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* 4px */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
  color: ${({ theme }) => theme.colors.gray[700]}; /* 라벨 색상은 어두운 회색 */
  font-weight: ${({ theme }) => theme.fontWeights.medium}; /* 살짝 두껍게 */
  text-align: left; /* 명시적으로 왼쪽 정렬 */
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none; /* 모든 기본 테두리 제거 */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[300]}; /* 아래쪽 테두리만 */
  padding: ${({ theme }) => theme.spacing[2]} 0; /* 상하 패딩만 주고 좌우 패딩은 0 */
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 16px */
  color: ${({ theme }) => theme.colors.primary}; /* 인풋 텍스트 색상: primary */
  background-color: transparent; /* 배경색 투명 (아래쪽 선만 보이도록) */
  box-sizing: border-box; /* padding이 너비에 포함되도록 */
  transition: border-bottom-color 0.2s ease; /* 포커스 시 테두리 색상 변경을 위한 트랜지션 */
  outline: none; /* 기본 아웃라인 제거 */
  border-radius: 0; /* 테두리가 바닥에만 있을 때 모서리 둥글게 할 필요가 없으므로 0 */

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.gray[400]}; /* 포커스 시 border 색상 primary로 */
    /* box-shadow는 아래 테두리만 있을 때는 어색할 수 있어 제거했습니다. 필요시 추가 */
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]}; /* placeholder 색상 */
  }
`;

export const LoginButton = styled(ButtonStyle)`
  width: 400px;
`;

export const LoginOptions = styled.div`
  margin-top: ${({ theme }) => theme.spacing[5]}; /* 20px */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
  color: ${({ theme }) => theme.colors.gray[600]};
  width: 400px; /* InputGroup 및 LoginButton과 동일한 너비로 설정 */
  /* LoginOptions 자체는 이제 LoginFormBox 내에서 중앙 정렬될 것입니다. */

  display: flex;
  flex-direction: column; /* Stack children vertically */
  gap: ${({ theme }) => theme.spacing[2]}; /* Small gap between checkbox line and links line */

  /* Style for the div containing the checkbox and label */
  & > div:first-of-type {
    display: flex; /* Make it a flex container */
    align-items: center; /* Vertically align checkbox and label */
    justify-content: flex-start; /* Checkbox and label to the left */
    width: 100%; /* 부모의 너비를 가득 채우도록 */
  }

  input[type='checkbox'] {
    vertical-align: middle; /* Ensures checkbox aligns with text */
    margin-right: ${({ theme }) => theme.spacing[2]}; /* 8px */
  }

  label {
    vertical-align: middle; /* Ensures label aligns with checkbox */
  }
`;

export const LoginLinksContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]}; /* 8px */
  display: flex; /* Use flexbox for horizontal arrangement of links and separators */
  justify-content: center; /* 내부 링크들을 중앙 정렬 */
  align-items: center; /* Vertically align links and separators */
  gap: ${({ theme }) => theme.spacing[2]}; /* Gap between link/separator components */
  width: 100%; /* 부모의 너비를 가득 채우도록 */
  /* margin: 0 auto; 제거 - justify-content: center; 가 더 적합 */
`;

export const OptionLink = styled.a`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary}; /* Highlight on hover */
  }
`;

export const LinkSeparator = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]}; /* A lighter gray for the separator */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* Same font size as links */
`;

export const SNSLoginDivider = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]}; /* 32px */
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* 20px */
  color: ${({ theme }) => theme.colors.gray[500]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]}; /* Lighter gray line */
    z-index: 1;
  }

  span {
    background-color: ${({ theme }) => theme.colors.white};
    padding: 0 ${({ theme }) => theme.spacing[2]}; /* 8px */
    position: relative;
    z-index: 2;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

export const SNSLoginIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]}; /* 16px */
  margin-top: ${({ theme }) => theme.spacing[3]}; /* 20px */
`;

export const SNSIcon = styled.img`
  width: ${({ theme }) => theme.spacing[10]}; /* 40px */
  height: ${({ theme }) => theme.spacing[10]}; /* 40px */
  border-radius: ${({ theme }) => theme.borderRadius.full}; /* Circular */
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-${({ theme }) => theme.spacing[1]}); /* -4px */
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
