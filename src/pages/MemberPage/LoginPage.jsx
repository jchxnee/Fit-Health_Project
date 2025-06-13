import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LoginContainer>
      <LoginTitle>로그인</LoginTitle>
      <LoginFormBox>
        <InputGroup>
          <StyledLabel htmlFor="username">아이디</StyledLabel>
          <StyledInput
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <StyledLabel htmlFor="password">비밀번호</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        {/* Only the "아이디 저장" checkbox div here, ABOVE LoginButton */}
        <LoginRememberMeOption>
          <input type="checkbox" id="remember-me" />
          <label htmlFor="remember-me">아이디저장</label>
        </LoginRememberMeOption>

        <LoginButton>로그인</LoginButton>

        {/* LoginLinksContainer is moved back BELOW LoginButton */}
        <LoginLinksContainer>
          <OptionLink href="#">아이디 찾기</OptionLink>
          <LinkSeparator>|</LinkSeparator>
          <OptionLink href="#">비밀번호 찾기</OptionLink>
          <LinkSeparator>|</LinkSeparator>
          <OptionLink href="#">회원가입</OptionLink>
        </LoginLinksContainer>

        <SNSLoginDivider>
          <span>SNS 계정으로 로그인</span>
        </SNSLoginDivider>
        <SNSLoginIcons>
          <SNSIcon src="/public/img/kakaotalk.png" alt="Kakao Login" />
          <SNSIcon src="/public/img/naver.png" alt="Naver Login" />
          <SNSIcon src="/public/img/google.png" alt="Google Login" />
        </SNSLoginIcons>
      </LoginFormBox>
    </LoginContainer>
  );
}

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing[20]}; /* 80px from theme.spacing */
  background-color: #fdfafa; /* Light background */
  width: 100%;
  box-sizing: border-box;
`;

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']}; /* 24px */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[8]}; /* 32px */
  color: ${({ theme }) => theme.colors.primary};
`;

const LoginFormBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]}; /* 40px */
  border-radius: ${({ theme }) => theme.borderRadius.ten}; /* 8px */
  box-shadow: ${({ theme }) => theme.shadows.base};
  width: 100%;
  max-width: 534px;
  height: 565px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]}; /* 20px */
  width: 350px;
`;

const StyledLabel = styled.label`
  display: block; /* 라벨을 블록 요소로 만들어 인풋 위에 위치시키고 왼쪽 정렬 */
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* 4px */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
  color: ${({ theme }) => theme.colors.gray[700]}; /* 라벨 색상은 어두운 회색 */
  font-weight: ${({ theme }) => theme.fontWeights.medium}; /* 살짝 두껍게 */
  text-align: left; /* 명시적으로 왼쪽 정렬 */
`;

const StyledInput = styled.input`
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

const LoginButton = styled(ButtonStyle)`
  width: 350px;
`;

const LoginRememberMeOption = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  width: 350px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  input[type='checkbox'] {
    vertical-align: middle;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }

  label {
    vertical-align: middle;
  }
`;

const LoginOptions = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};

  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  width: 400px;

  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  input[type='checkbox'] {
    vertical-align: middle;
    margin-right: ${({ theme }) => theme.spacing[2]}; /* 8px */
  }

  label {
    vertical-align: middle;
  }
`;

const LoginLinksContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[5]}; /* 20px - space below login button */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

const OptionLink = styled.a`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary}; /* Highlight on hover */
  }
`;

const LinkSeparator = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]}; /* A lighter gray for the separator */
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* Same font size as links */
`;

const SNSLoginDivider = styled.div`
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

const SNSLoginIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]}; /* 16px */
  margin-top: ${({ theme }) => theme.spacing[3]}; /* 20px */
`;

const SNSIcon = styled.img`
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
