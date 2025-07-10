import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import theme from '../../styles/theme';
import { useNavigate } from 'react-router-dom';

function FindPwdPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailAuthMessage, setEmailAuthMessage] = useState('');

  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerIdRef = useRef(null);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (!isTimerActive) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      return;
    }

    if (timer === 0) {
      setIsTimerActive(false);
      setEmailAuthMessage('인증 시간이 만료되었습니다. 새로고침 후 다시 시도해주세요.');
      toast.error('인증 시간이 만료되었습니다.');
      return;
    }

    timerIdRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerIdRef.current);
  }, [isTimerActive, timer]);

  const handleEmailAuthClick = async () => {
    if (!name.trim()) {
      setEmailAuthMessage('이름을 입력해주세요.');
      toast.error('이름을 입력해주세요.');
      return;
    }
    if (!isEmailValid) {
      setEmailAuthMessage('유효한 이메일 주소를 입력해주세요.');
      toast.error('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const response = await api.get(`/api/members/exists`, {
        params: {
          userName: name,
          userEmail: email,
        },
      });
      const userExists = response.data;

      if (!userExists) {
        setEmailAuthMessage('입력하신 이름과 이메일 정보가 일치하는 회원이 없습니다.');
        toast.error('입력하신 정보와 일치하는 회원이 없습니다.');
        setIsEmailVerified(false);
        setShowAuthCodeInput(false);
        return;
      }

      setIsEmailVerified(false);
      setEmailAuthMessage('');
      setShowAuthCodeInput(true);

      const dto = {
        to: email,
        subject: 'FIT:HEALTH 비밀번호 찾기 이메일 인증',
        title: '인증 번호 요청',
        body: '비밀번호 변경을 위해 아래 인증번호를 입력해주세요.',
      };

      const formData = new FormData();
      formData.append('mail', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

      await api.post('/mail/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('인증번호가 이메일로 발송되었습니다. 확인해주세요.');
      setEmailAuthMessage('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
      setIsTimerActive(true);
      setTimer(180);
    } catch (error) {
      console.error('회원 확인 또는 이메일 인증 요청 중 오류:', error);

      if (error.response && error.response.status === 400) {
        // HttpStatus.BAD_REQUEST (400)
        const errorMessage = error.response.data; // 백엔드에서 보낸 body 메시지
        if (errorMessage === '소셜 로그인으로 가입된 회원은 비밀번호를 재설정할 수 없습니다.') {
          setEmailAuthMessage(errorMessage);
          toast.error(errorMessage);
          setIsEmailVerified(false);
          setShowAuthCodeInput(false);
          setIsTimerActive(false);
          setTimer(0);
          navigate('/login');
          return;
        }
      }

      setEmailAuthMessage('요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
      toast.error('요청에 실패했습니다.');
      setIsTimerActive(false);
      setTimer(0);
    }
  };

  const handleVerifyAuthCode = async () => {
    if (!authCode) {
      setEmailAuthMessage('인증번호를 입력해주세요.');
      toast.warn('인증번호를 입력해주세요.');
      return;
    }
    try {
      const result = await api.get('/mail/check', {
        params: { email, code: authCode },
      });

      if (result.data === true) {
        setIsEmailVerified(true);
        setEmailAuthMessage('이메일 인증이 성공하였습니다.');
        toast.success('이메일 인증 성공! 비밀번호 재설정 페이지로 이동합니다.');
        setIsTimerActive(false);

        navigate('/ResetPwdPage', { state: { userEmail: email } });
      } else {
        setIsEmailVerified(false);
        setEmailAuthMessage('인증번호가 올바르지 않습니다.');
        toast.error('인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 확인 중 오류:', error);
      setEmailAuthMessage('이메일 확인 중 문제가 발생했습니다.');
      toast.error('인증번호 확인에 실패했습니다.');
    }
  };

  return (
    <PageContainer>
      <FindPwdBox>
        <Title>비밀번호 찾기</Title>

        {/* 이름 입력 필드 (플로팅 라벨) */}
        <InputContainer $hasValue={name.length > 0}>
          <InputField
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setEmailAuthMessage('');
              setIsEmailVerified(false);
              setShowAuthCodeInput(false);
              setIsTimerActive(false);
              setTimer(180);
            }}
            disabled={isEmailVerified}
            placeholder="" /* placeholder가 있어야 :not(:placeholder-shown) 셀렉터가 작동 */
          />
          <Label htmlFor="name">이름</Label>
        </InputContainer>

        {/* 이메일 입력 및 인증 버튼 (플로팅 라벨 + 옆 버튼) */}
        <InputContainer $hasValue={email.length > 0}>
          <EmailAuthWrapper>
            <EmailAuthInput
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailAuthMessage('');
                setIsEmailVerified(false);
                setShowAuthCodeInput(false);
                setIsTimerActive(false);
                setTimer(180);
              }}
              disabled={isEmailVerified}
              $error={!isEmailValid && email.length > 0}
              placeholder="" /* placeholder가 있어야 :not(:placeholder-shown) 셀렉터가 작동 */
            />
            <EmailAuthButton
              type="button"
              onClick={handleEmailAuthClick}
              disabled={!name.trim() || !isEmailValid || isEmailVerified}
            >
              {isEmailVerified ? '인증 완료' : '인증번호 받기'}
            </EmailAuthButton>
          </EmailAuthWrapper>
          <Label htmlFor="email">이메일 (아이디)</Label>
          {email.length > 0 && !isEmailValid && <ErrorMessage>유효한 이메일 주소를 입력해주세요.</ErrorMessage>}
        </InputContainer>

        {/* 인증 번호 입력 영역 (고정 라벨) */}
        {showAuthCodeInput && !isEmailVerified && (
          <InputContainer>
            {' '}
            {/* 이 InputContainer는 $hasValue 사용하지 않음 */}
            <AuthCodeWrapper>
              <AuthCodeInput
                type="text"
                id="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                disabled={!isTimerActive || isEmailVerified}
                placeholder=""
              />
              <TimerText>
                {isTimerActive
                  ? `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`
                  : '시간 만료'}
              </TimerText>
              <VerifyAuthCodeButton
                type="button"
                onClick={handleVerifyAuthCode}
                disabled={!authCode || isEmailVerified || !isTimerActive}
              >
                확인
              </VerifyAuthCodeButton>
            </AuthCodeWrapper>
            {/* 인증번호 라벨만 고정된 스타일을 적용 */}
            <AuthCodeLabel htmlFor="authCode">인증번호</AuthCodeLabel>
            {emailAuthMessage && <EmailMessage $isSuccess={isEmailVerified}>{emailAuthMessage}</EmailMessage>}
          </InputContainer>
        )}

        <LinkContainer>
          <StyledLink href="/signup">회원가입하기</StyledLink>
          <StyledLink href="/login">로그인하기</StyledLink>
        </LinkContainer>
      </FindPwdBox>
    </PageContainer>
  );
}

export default FindPwdPage;

// --- 스타일 컴포넌트 ---

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: ${theme.spacing[24]};
  background-color: #fdfafa;
  width: 100%;
`;

const FindPwdBox = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[10]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto;
  justify-content: flex-start;
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[10]};
  text-align: center;
`;

// 이름, 이메일 필드를 위한 InputContainer (플로팅 라벨용)
const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${theme.spacing[8]};

  /* $hasValue prop에 따라 라벨 스타일 변경 (플로팅 라벨의 핵심) */
  ${({ $hasValue }) =>
    $hasValue &&
    `
    label {
      top: ${theme.spacing[0]}; /* 입력 시 라벨이 올라가는 위치 */
      font-size: ${theme.fontSizes.xs}; /* 입력 시 라벨 폰트 크기 */
      color: ${theme.colors.secondary};
    }
  `}
`;

// 이름, 이메일 필드를 위한 Label (플로팅 라벨용)
const Label = styled.label`
  position: absolute;
  left: ${theme.spacing[4]};
  top: 50%; /* 입력 필드 중앙에 위치 (초기 위치) */
  transform: translateY(-50%); /* 정확히 중앙 정렬 (초기 위치) */
  font-size: ${theme.fontSizes.base}; /* 초기 폰트 크기 */
  color: ${theme.colors.gray[500]};
  pointer-events: none;
  transition: all 0.2s ease-out; /* 플로팅 애니메이션 */
  background-color: ${theme.colors.white};
  padding: 0 ${theme.spacing[1]};
  z-index: 1;
`;

// 인증번호 필드를 위한 고정 라벨 (새로 생성)
const AuthCodeLabel = styled.label`
  position: absolute;
  left: ${theme.spacing[4]}; /* InputField의 padding-left와 동일하게 설정 */
  top: ${theme.spacing[1]};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.secondary};
  pointer-events: none;
  background-color: ${theme.colors.white};
  padding: 0 ${theme.spacing[1]};
  z-index: 1; /* 라벨이 필드 위에 오도록 */
`;

// 이름, 이메일 필드를 위한 InputField (플로팅 라벨용 패딩 및 스타일)
const InputField = styled.input`
  width: 100%;
  padding: ${theme.spacing[4]} ${theme.spacing[4]}; /* 상하 16px, 좌우 16px */
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[800]};
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 0;

  &:focus {
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 0 3px ${theme.colors.skyblue};

    & + ${Label} {
      /* 포커스 시 라벨 변경 (플로팅 라벨의 핵심) */
      top: ${theme.spacing[0]};
      font-size: ${theme.fontSizes.xs};
      color: ${theme.colors.secondary};
    }
  }

  &:not(:placeholder-shown) + ${Label} {
    /* 플레이스홀더 텍스트가 사라지면 (즉, 값이 입력되면) 라벨 변경 (플로팅 라벨의 핵심) */
    top: ${theme.spacing[0]};
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const EmailAuthWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  width: 100%;
`;

const EmailAuthInput = styled(InputField)`
  flex-grow: 1;
  min-width: 0;
`;

const EmailAuthButton = styled(ButtonStyle)`
  height: 56px;
  min-width: 120px;
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.button};
  border-color: ${theme.colors.button};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.gray[400]};
    border-color: ${theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const AuthCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  width: 100%;
  position: relative;
`;

const AuthCodeInput = styled(InputField)`
  padding: ${theme.spacing[6]} ${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[4]}; /* 상, 우, 하, 좌 패딩 */
  flex-grow: 1;
  min-width: 0;

  &:focus {
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 0 3px ${theme.colors.skyblue};
  }

  &:not(:placeholder-shown) {
  }
`;

const VerifyAuthCodeButton = styled(ButtonStyle)`
  height: 56px;
  min-width: 80px;
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.button};
  border-color: ${theme.colors.button};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.gray[400]};
    border-color: ${theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const TimerText = styled.span`
  position: absolute;
  right: calc(
    ${theme.spacing[4]} + 80px + ${theme.spacing[2]}
  ); /* 16px (InputField padding-right) + 80px (버튼 너비) + 8px (gap) */
  top: 50%;
  transform: translateY(-50%);
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.danger};
  user-select: none;
  pointer-events: none;
  z-index: 2; /* 라벨과 입력 텍스트 위에 오도록 */
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing[1]};
  text-align: left;
  width: 100%;
  padding-left: ${theme.spacing[1]};
`;

const EmailMessage = styled(ErrorMessage)`
  color: ${({ $isSuccess }) => ($isSuccess ? theme.colors.success : theme.colors.danger)};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  margin-top: ${theme.spacing[3]};
  margin-left: 0;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[6]};
  width: 100%;
  margin-top: ${theme.spacing[8]};
`;

const StyledLink = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[600]};
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.2s ease-in-out,
    text-decoration 0.2s ease-in-out;

  &:hover {
    color: ${theme.colors.secondary};
    text-decoration: underline;
  }
`;
