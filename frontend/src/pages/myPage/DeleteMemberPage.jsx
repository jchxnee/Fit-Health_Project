import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { toast } from 'react-toastify';
import { memberService } from '../../api/member';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const DeleteMemberPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const { user } = useUserStore();
  const logout = useUserStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (isLoading) return; // 로딩 중이면 아무 작업도 하지 않음

    if (currentPassword === '') {
      toast.error('현재 비밀번호를 입력해주세요.');
      return;
    }

    const confirmWithdrawal = window.confirm('정말 탈퇴하시겠습니까?');
    if (!confirmWithdrawal) {
      toast.error('회원 탈퇴가 취소되었습니다.');
      console.log('회원 탈퇴 취소');
      return;
    }

    try {
      setIsLoading(true);

      const checkData = {
        useremail: user.email,
        userpwd: currentPassword,
      };

      const checkuser = await memberService.login(checkData);

      if (!checkuser) {
        toast.error('현재 비밀번호가 일치하지 않습니다.');
        return;
      }

      await memberService.deleteMember(user.email);

      logout();
      toast.success('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
      navigate('/');
    } catch (error) {
      toast.error('회원 탈퇴 중 오류가 발생했습니다.');
      console.error('회원 탈퇴 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WithdrawContainer>
        <WithdrawForm onSubmit={handleWithdraw}>
          <PageTitle>회원 탈퇴</PageTitle>

          <InputGroup>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <StyledInput
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </InputGroup>

          <WithdrawButton type="submit" disabled={isLoading}>
            회원 탈퇴
          </WithdrawButton>
        </WithdrawForm>
      </WithdrawContainer>
    </>
  );
};

export default DeleteMemberPage;

const WithdrawContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['32']};
  background-color: #f9fafa;
  min-height: calc(100vh - 60px); /* 헤더 높이를 제외한 최소 높이 */
  box-sizing: border-box;
  width: 100%;
  font-family: 'Noto Sans KR', sans-serif;
`;

const WithdrawForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['10']} ${({ theme }) => theme.spacing['20']};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center; /* 전체 폼 내용을 중앙 정렬 */
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
  width: 100%;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  width: 100%;
  max-width: 480px;
  text-align: left; /* 라벨은 왼쪽 정렬 유지 */
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2']} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const WithdrawButton = styled(ButtonStyle)`
  width: 100%;
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing['8']}; /* Margin above button */
  background-color: ${({ theme }) => theme.colors.danger};
`;
