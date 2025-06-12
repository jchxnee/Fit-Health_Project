import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../styles/common/Button';

const MemberInfoPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('010-1234-5678'); // 더미 데이터
  const [email, setEmail] = useState('user@example.com'); // 더미 데이터
  const [currentPassword, setCurrentPassword] = useState(''); // 더미 데이터
  const [newPassword, setNewPassword] = useState(''); // 더미 데이터
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // 더미 데이터

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('개인 정보 변경 처리');
    // 여기에 개인 정보 변경 로직 (API 호출 등) 추가
  };

  return (
    <PersonalInfoContainer>
      <PersonalInfoForm onSubmit={handleSubmit}>
        <PageTitle>개인 정보 관리</PageTitle>

        <InputGroup>
          <Label htmlFor="phoneNumber">전화번호</Label>
          <Input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="하이픈 없이 숫자만 입력"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소 입력"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="currentPassword">현재 비밀번호</Label>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="newPassword">새 비밀번호</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 (8~16자, 영문/숫자/특수문자)"
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="confirmNewPassword">비밀번호 확인</Label>
          <Input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="새 비밀번호 다시 입력"
          />
        </InputGroup>

        <SubmitButton type="submit">개인 정보 변경</SubmitButton>
      </PersonalInfoForm>
    </PersonalInfoContainer>
  );
};

export default MemberInfoPage;

const PersonalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['20']}; /* Top padding for the content below header */
  background-color: #f9fafa;
  min-height: calc(100vh - 60px); /* Adjust for header height if it's 60px */
  box-sizing: border-box;
  width: 100%;
`;

const PersonalInfoForm = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]}; /* 40px */
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 700px; /* Consistent with other forms */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']}; /* 24px */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-bottom: ${({ theme }) => theme.spacing['10']}; /* Space below title */
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column; /* Label and Input are stacked */
  margin-bottom: ${({ theme }) => theme.spacing['6']}; /* Space between input groups */
  width: 100%;
  max-width: 480px; /* Consistent input width */
  text-align: left;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* Space between label and input */
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2']} 0; /* 상하 패딩, 좌우 0 */
  border: none; /* No border initially */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']}; /* Only bottom border */
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  box-sizing: border-box;
  outline: none; /* Remove outline on focus */
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary}; /* Primary color on focus */
  }
`;

const SubmitButton = styled(ButtonStyle)`
  width: 80%;
  margin-top: ${({ theme }) => theme.spacing['8']}; /* Margin above button */
`;
