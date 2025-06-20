import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { memberService } from '../../api/member';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const signUpSchema = yup.object().shape({
  currentPassword: yup.string().required('현재 비밀번호를 입력해주세요.'),

  newPassword: yup
    .string()
    .min(8, '비밀번호는 8자 이상 입력해주세요.')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+`~])[a-zA-Z\d!@#$%^&*()\-_=+`~]{8,16}$/,
      '비밀번호는 영문자, 숫자, 특수문자를 모두 포함해서 입력해주세요.'
    )
    .required('새 비밀번호를 입력해주세요.'),

  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력해주세요.'),
});

const ChangePwdPage = () => {
  const { user } = useUserStore();
  const logout = useUserStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const checkData = {
        useremail: user.email,
        userpwd: data.currentPassword,
      };

      const checkuser = await memberService.login(checkData);

      if (!checkuser) {
        toast.error('현재 비밀번호가 일치하지 않습니다.');
        return;
      }

      await memberService.changePwd(user.email, data.newPassword);

      logout();
      toast.success('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      navigate('/');
    } catch (error) {
      toast.error('비밀번호 변경 중 오류가 발생했습니다.');
      console.error('비밀번호 변경 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = (formErrors) => {
    console.log('폼 에러:', formErrors); // ✅ 콘솔 확인
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <>
      <PersonalInfoContainer>
        <PersonalInfoForm onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <PageTitle>비밀번호 변경</PageTitle>

          <InputGroup>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              type="password"
              id="currentPassword"
              {...register('currentPassword')}
              placeholder="현재 비밀번호 입력"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              placeholder="새 비밀번호 (8~16자, 영문/숫자/특수문자)"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmNewPassword">비밀번호 확인</Label>
            <Input
              type="password"
              id="confirmNewPassword"
              {...register('confirmNewPassword')}
              placeholder="새 비밀번호 다시 입력"
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            비밀번호 변경
          </SubmitButton>
        </PersonalInfoForm>
      </PersonalInfoContainer>
    </>
  );
};

export default ChangePwdPage;

const PersonalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['20']};
  background-color: #f9fafa;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  width: 100%;
`;

const PersonalInfoForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  width: 100%;
  max-width: 480px;
  text-align: left;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2']} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
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

const SubmitButton = styled(ButtonStyle)`
  width: 80%;
  margin-top: ${({ theme }) => theme.spacing['8']};
`;
