import React from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';

const FindPwdPage = () => {
  return (
    <PageContainer>
      <FindPwdBox>
        <Title>비밀번호 찾기</Title>
        <InputField type="text" placeholder="아이디" />
        <InputField type="text" placeholder="이름" />
        <SubmitButton>비밀번호 찾기</SubmitButton>
        <LinkContainer>
          <StyledLink href="#">회원가입하기</StyledLink>
          <StyledLink href="#">로그인하기</StyledLink>
        </LinkContainer>
      </FindPwdBox>
    </PageContainer>
  );
};

export default FindPwdPage;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing[24]};
  background-color: #fdfafa;
  width: 100%;
`;

const FindPwdBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[16]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.base};
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 50vh;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const InputField = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.skyblue};
  }
`;

const SubmitButton = styled(ButtonStyle)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: 12px 120px;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StyledLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
