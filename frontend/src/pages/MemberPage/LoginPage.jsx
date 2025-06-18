import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../hooks/member/useLoginForm';

function LoginPage() {
  const { register, handleSubmit, onsubmit, errors, isLoading } = useLoginForm();
  return (
    <>
      <LoginContainer>
        <LoginTitle>로그인</LoginTitle>
        <LoginFormBox onSubmit={handleSubmit(onsubmit)}>
          <InputGroup>
            <StyledLabel htmlFor="useremail">이메일</StyledLabel>
            <StyledInput type="email" id="useremail" required {...register('useremail')} $error={errors.useremail} />
          </InputGroup>
          <InputGroup>
            <StyledLabel htmlFor="userpwd">비밀번호</StyledLabel>
            <StyledInput type="password" id="userpwd" required {...register('userpwd')} $error={errors.userpwd} />
          </InputGroup>

          <LoginRememberMeOption>
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">아이디저장</label>
          </LoginRememberMeOption>

          <LoginButton type="submit" disabled={isLoading}>
            로그인
          </LoginButton>

          <LoginLinksContainer>
            <OptionLink href="#">아이디 찾기</OptionLink>
            <LinkSeparator>|</LinkSeparator>
            <OptionLink href="#">비밀번호 찾기</OptionLink>
            <LinkSeparator>|</LinkSeparator>
            <OptionLink to="/signup">회원가입</OptionLink>
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
    </>
  );
}

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing[20]};
  background-color: #fdfafa;
  width: 100%;
  box-sizing: border-box;

  input,
  a,
  button {
    outline: none;
  }
`;

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.primary};
`;

const LoginFormBox = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
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
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  width: 350px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: left;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[300]};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  box-sizing: border-box;
  transition: border-bottom-color 0.2s ease;
  outline: none;
  border-radius: 0;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.gray[400]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
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

const LoginLinksContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[5]};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

const OptionLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LinkSeparator = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SNSLoginDivider = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.gray[500]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    z-index: 1;
  }

  span {
    background-color: ${({ theme }) => theme.colors.white};
    padding: 0 ${({ theme }) => theme.spacing[2]};
    position: relative;
    z-index: 2;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const SNSLoginIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const SNSIcon = styled.img`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-${({ theme }) => theme.spacing[1]});
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
