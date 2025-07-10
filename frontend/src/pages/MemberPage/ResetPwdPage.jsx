import React, { useState, useEffect } from 'react'; // useEffect 추가 (userEmail prop 받기 위해)
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { memberService } from '../../api/member';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import theme from '../../styles/theme';

// 1. signUpSchema 수정: currentPassword 제거
const resetPwdSchema = yup.object().shape({
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

const ResetPwdPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // location 훅 사용하여 state 접근

  const [userEmail, setUserEmail] = useState(''); // 비밀번호 찾기에서 넘어온 이메일

  useEffect(() => {
    if (location.state && location.state.userEmail) {
      setUserEmail(location.state.userEmail);
    } else {
      // 이메일 정보 없이 접근한 경우, 로그인 페이지 등으로 리다이렉트
      toast.error('이메일 정보가 없습니다. 다시 시도해주세요.');
      navigate('/login');
    }
  }, [location.state, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPwdSchema), // 수정된 스키마 적용
  });

  // 2. onSubmit 함수 수정: currentPassword 관련 로직 제거 및 이메일 전송
  const onSubmit = async (data) => {
    if (!userEmail) {
      toast.error('이메일 정보가 없어 비밀번호를 변경할 수 없습니다.');
      navigate('/login'); // 혹은 find-pwd 페이지로
      return;
    }

    try {
      setIsLoading(true);

      // 백엔드에 보낼 데이터 (이메일과 새 비밀번호)
      const resetPwdData = {
        userEmail: userEmail, // FindPwdPage에서 받아온 이메일 사용
        newPassword: data.newPassword,
      };

      // memberService에 비밀번호 재설정(resetPwd) 메서드가 있다고 가정
      // 이 메서드는 이메일과 새 비밀번호를 받아 처리합니다.
      await memberService.resetPassword(resetPwdData); // API 호출 수정

      toast.success('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      navigate('/login'); // 변경 후 로그인 페이지로 이동
    } catch (error) {
      console.error('비밀번호 재설정 에러 : ', error);
      // 백엔드에서 특정 오류 메시지를 보낼 경우를 대비하여 에러 응답 처리 추가
      if (error.response && error.response.data) {
        toast.error(`비밀번호 재설정 실패: ${error.response.data}`);
      } else {
        toast.error('비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = (formErrors) => {
    console.log('폼 에러:', formErrors);
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <>
      <PageContainer>
        <ChangePwdBox onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <PageTitle>비밀번호 재설정</PageTitle>
          <InputContainer $hasValue={register('newPassword').value?.length > 0}>
            <InputField type="password" id="newPassword" {...register('newPassword')} placeholder=" " />
            <Label htmlFor="newPassword">새 비밀번호</Label>
          </InputContainer>
          {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
          <InputContainer $hasValue={register('confirmNewPassword').value?.length > 0}>
            <InputField type="password" id="confirmNewPassword" {...register('confirmNewPassword')} placeholder=" " />
            <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
          </InputContainer>
          {errors.confirmNewPassword && <ErrorMessage>{errors.confirmNewPassword.message}</ErrorMessage>}
          <SubmitButton type="submit" disabled={isLoading}>
            비밀번호 재설정
          </SubmitButton>
        </ChangePwdBox>
      </PageContainer>
    </>
  );
};

export default ResetPwdPage;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: ${theme.spacing[24]};
  background-color: #fdfafa;
  width: 100%;
`;

const ChangePwdBox = styled.form`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[10]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto;
  justify-content: flex-start;
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[10]};
  text-align: center;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${theme.spacing[8]};

  ${({ $hasValue }) =>
    $hasValue &&
    `
    label {
      top: ${theme.spacing[0]};
      font-size: ${theme.fontSizes.xs};
      color: ${theme.colors.secondary};
    }
  `}
`;

const Label = styled.label`
  position: absolute;
  left: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[500]};
  pointer-events: none;
  transition: all 0.2s ease-out;
  background-color: ${theme.colors.white};
  padding: 0 ${theme.spacing[1]};
  z-index: 1;
`;

const InputField = styled.input`
  width: 100%;
  padding: ${theme.spacing[4]} ${theme.spacing[4]};
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[800]};
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 0;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 0 3px ${theme.colors.skyblue};

    & + ${Label} {
      top: ${theme.spacing[0]};
      font-size: ${theme.fontSizes.xs};
      color: ${theme.colors.secondary};
    }
  }

  &:not(:placeholder-shown) + ${Label} {
    top: ${theme.spacing[0]};
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.secondary};
  }
`;

const SubmitButton = styled(ButtonStyle)`
  width: 100%;
  margin-top: ${theme.spacing[8]};
  height: 56px;
  font-size: ${theme.fontSizes.lg};
  background-color: ${theme.colors.button};
  border-color: ${theme.colors.button};
  border-radius: ${theme.borderRadius.lg};

  &:hover {
    background-color: ${theme.colors.button};
  }

  &:disabled {
    background-color: ${theme.colors.gray[400]};
    border-color: ${theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[6]};
  text-align: left;
  width: 100%;
  padding-left: ${theme.spacing[1]};
`;
