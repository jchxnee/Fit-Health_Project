import React, { useState } from 'react';
import styled from 'styled-components';
import logoSrc from '../../assets/header_icon.png';
import ButtonStyle from '../../styles/common/Button';
import { toast } from 'react-toastify';
import { useSignUpForm } from '../../hooks/member/useSignUpForm';

function SignUpPage() {
  const { register, handleSubmit, onsubmit: handleFormSubmit, errors, isSubmitting, trigger, watch } = useSignUpForm(); // watch 추가 (email 값 읽기 위함)

  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [showServiceTerms, setShowServiceTerms] = useState(false);
  const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');

  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 성공 여부
  const [emailAuthMessage, setEmailAuthMessage] = useState(''); // 이메일 인증 관련 메시지

  // email 필드의 현재 값을 가져옵니다.
  const emailValue = watch('email');

  const onSubmitHandler = (data) => {
    if (!agreeService || !agreePrivacy) {
      toast.error('필수 약관에 모두 동의해야 회원가입을 할 수 있습니다.');
      return;
    }

    if (!isEmailVerified) {
      toast.error('이메일 인증을 진행해주세요.');
      return;
    }

    console.log('Form Data:', data);
    handleFormSubmit(data);
  };

  // ★ handleEmailAuthClick 함수 수정
  const handleEmailAuthClick = async () => {
    // 1. 이메일 필드의 유효성 검사를 수동으로 트리거합니다.
    const isValid = await trigger('email');

    // 2. 유효성 검사가 실패하면 에러 메시지를 설정하고 함수를 종료합니다.
    if (!isValid) {
      // errors.email에 Yup 스키마에서 정의한 에러 메시지가 이미 있습니다.
      // emailAuthMessage 상태를 업데이트하여 해당 에러 메시지를 표시합니다.
      setEmailAuthMessage(errors.email?.message || '유효한 이메일 주소를 입력해주세요.'); // errors.email이 없을 경우 대비
      setIsEmailVerified(false); // 인증 실패 상태로 초기화
      setShowAuthCodeInput(false); // 인증 코드 입력창 숨김 (필요시)
      return;
    }

    // 3. 이메일 필드가 유효하면 인증번호 발송 로직을 진행합니다.
    // 기존 인증 상태 및 메시지 초기화
    setIsEmailVerified(false);
    setEmailAuthMessage(''); // 에러가 없으면 메시지 초기화

    // 여기에 이메일 인증번호 발송 API 호출 로직을 추가
    // 이메일 주소를 서버로 보내 인증번호 발송 요청
    console.log(`인증번호 발송 요청: ${emailValue}`); // watch로 가져온 emailValue 사용

    // API 호출 성공 시
    setShowAuthCodeInput(true);
    alert('인증번호가 이메일로 발송되었습니다. 확인해주세요.');
    setEmailAuthMessage('인증번호가 발송되었습니다. 이메일을 확인해주세요.'); // 발송 성공 메시지
  };

  const handleVerifyAuthCode = () => {
    console.log('입력된 인증번호:', authCode);
    if (authCode === '123456') {
      // 예시: 실제로는 서버에서 확인
      setIsEmailVerified(true); // 인증 성공 상태로 변경
      setEmailAuthMessage('이메일 인증이 성공하였습니다.'); // 성공 메시지 설정
      // 이메일 필드를 읽기 전용으로 만들거나 비활성화
      // 이메일 인증이 성공했으므로, 이메일 주소 변경을 막을 수 있음
    } else {
      setIsEmailVerified(false); // 인증 실패 상태 (혹시 성공했다가 실패할 경우 대비)
      setEmailAuthMessage('인증번호가 올바르지 않습니다.'); // 실패 메시지 설정
    }
  };

  return (
    <SignupContainer>
      <LogoImage src={logoSrc} alt="FIT:HEALTH 로고" />
      <SignupForm onSubmit={handleSubmit(onSubmitHandler)}>
        <FormTitle>회원가입</FormTitle>

        <InputGroup>
          <Label htmlFor="useremail">이메일*</Label>
          <EmailAuthContainer>
            <EmailAuthInput
              type="email"
              id="useremail"
              placeholder="이메일 주소 입력"
              {...register('email')}
              $error={errors.email}
              disabled={isEmailVerified} // 인증 성공 시 비활성화
            />
            {/* ★ 변경: EmailAuthButton에서 register 제거 */}
            <EmailAuthButton
              type="button"
              onClick={handleEmailAuthClick}
              disabled={isEmailVerified} // 인증 성공 시 비활성화
            >
              {isEmailVerified ? '인증 완료' : '이메일 인증'}
            </EmailAuthButton>
          </EmailAuthContainer>
          {/* React Hook Form의 이메일 유효성 에러 메시지 (errors.email이 있을 때만 표시) */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </InputGroup>

        {/* --- 새로 추가된 인증 번호 입력 영역 --- */}
        {showAuthCodeInput && (
          <AuthCodeInputGroup>
            <AuthCodeInput
              type="text"
              placeholder="인증번호 6자리 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <VerifyAuthCodeButton type="button" onClick={handleVerifyAuthCode} disabled={isEmailVerified}>
              확인
            </VerifyAuthCodeButton>
            {/* 인증 번호 입력 후 메시지 */}
            {emailAuthMessage && showAuthCodeInput && (
              <EmailMessage $isSuccess={isEmailVerified}>{emailAuthMessage}</EmailMessage>
            )}
          </AuthCodeInputGroup>
        )}

        {/* ... (나머지 폼 요소들) ... */}

        <InputGroup>
          <Label htmlFor="userpwd">비밀번호*</Label>
          <Input
            type="password"
            id="userpwd"
            placeholder="비밀번호 8~16자 (영문, 숫자, 특수문자 포함)"
            {...register('password')}
            $error={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="passwordConfirm">비밀번호 확인*</Label>
          <Input
            type="password"
            id="passwordConfirm"
            placeholder="비밀번호 재입력"
            {...register('passwordConfirm')}
            $error={errors.passwordConfirm}
          />
          {errors.passwordConfirm && <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup $hasError={errors.username}>
          <Label htmlFor="username">이름*</Label>
          <Input type="text" id="username" placeholder="이름 입력" {...register('username')} $error={errors.username} />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup $hasError={errors.phone}>
          <Label htmlFor="phone">전화번호*</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="하이픈 없이 숫자만 입력해주세요."
            {...register('phone')}
            $error={errors.phone}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="birth">생년월일</Label>
          <Input type="date" id="birth" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
        </InputGroup>

        <TermsAndConditionsGroup>
          <SectionTitle>약관 동의</SectionTitle>
          <TermLabel htmlFor="agreeService">
            <TermCheckbox
              type="checkbox"
              id="agreeService"
              checked={agreeService}
              onChange={(e) => setAgreeService(e.target.checked)}
            />
            [필수] 이용약관에 동의합니다.
            <TermLink
              onClick={(e) => {
                e.preventDefault();
                setShowServiceTerms(!showServiceTerms);
              }}
            >
              (자세히 보기)
            </TermLink>
          </TermLabel>
          {/* 이용약관 내용 */}
          <TermsContent $isOpen={showServiceTerms}>
            <p>
              이용약관 내용이 여기에 표시됩니다. <br />
              본 이용약관은 FIT:HEALTH 서비스(이하 '서비스')의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다. 서비스를 이용하기 전에 본 약관을 충분히 숙지하시고 동의
              여부를 결정하시기 바랍니다.
              <br />
              <br />
              제 1 조 (목적) <br />
              본 약관은 FIT:HEALTH 서비스의 이용조건 및 절차, 회사와 회원 간의 권리·의무 및 책임사항 등을 규정함을
              목적으로 합니다.
              <br />
              <br />
              제 2 조 (정의) <br />
              1. '서비스'라 함은 FIT:HEALTH가 제공하는 모든 서비스를 의미합니다. 2. '회원'이라 함은 서비스에 접속하여 본
              약관에 따라 FIT:HEALTH가 제공하는 서비스를 이용하는 자를 말합니다. 3. '아이디'라 함은 회원의 식별과 서비스
              이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.
              <br />
              <br />
              ... (더 많은 약관 내용) ...
            </p>
          </TermsContent>

          <TermLabel htmlFor="agreePrivacy">
            <TermCheckbox
              type="checkbox"
              id="agreePrivacy"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            [필수] 개인정보 수집/이용에 동의합니다.
            <TermLink
              onClick={(e) => {
                e.preventDefault();
                setShowPrivacyTerms(!showPrivacyTerms);
              }}
            >
              (자세히 보기)
            </TermLink>
          </TermLabel>
          {/* 개인정보 수집/이용 내용 */}
          <TermsContent $isOpen={showPrivacyTerms}>
            <p>
              개인정보 수집 및 이용 내용이 여기에 표시됩니다. <br />
              FIT:HEALTH는 회원 가입, 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              <br />
              <br />
              1. 수집하는 개인정보 항목: 아이디, 비밀번호, 이메일, 이름, 전화번호, 생년월일 등 2. 개인정보 수집 및 이용
              목적: 서비스 제공, 회원 관리, 신규 서비스 개발 및 맞춤 서비스 제공, 마케팅 및 광고에 활용 3. 개인정보 보유
              및 이용 기간: 회원 탈퇴 시까지 또는 관련 법령에 따라 일정 기간 보관
              <br />
              <br />
              이용자는 개인정보 수집 및 이용에 동의하지 않을 권리가 있습니다. 단, 동의하지 않을 경우 회원가입 및 서비스
              이용이 제한될 수 있습니다.
              <br />
              <br />
              ... (더 많은 개인정보 약관 내용) ...
            </p>
          </TermsContent>
        </TermsAndConditionsGroup>

        <SignUpButton type="submit">회원가입</SignUpButton>
      </SignupForm>
    </SignupContainer>
  );
}

export default SignUpPage;

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['10']};
  background-color: #fdfafa;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;

  input,
  a,
  button {
    outline: none;
  }
`;

const LogoImage = styled.img`
  width: auto;
  height: 40px;
  margin-bottom: ${({ theme }) => theme.spacing['12']};
`;

const SignupForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['10']};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 580px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-top: ${({ theme }) => theme.spacing['6']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  width: 100%;
  text-align: left;
`;

const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  width: 100%;
  max-width: 480px;
  padding-bottom: ${({ theme, $hasError }) => ($hasError ? theme.spacing['4'] : '0')};
  position: relative;

  &:has(label > input[type='checkbox']) {
    margin-bottom: ${({ theme }) => theme.spacing['2']};
    padding-bottom: ${({ theme, $hasError }) => ($hasError ? theme.spacing['4'] : '0')};
  }
`;

const Label = styled.label`
  flex-basis: 120px;
  min-width: 120px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};
  text-align: left;
  margin-right: ${({ theme }) => theme.spacing['3']};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  padding-top: ${({ theme }) => theme.spacing['3']};
`;

const Input = styled.input`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  box-sizing: border-box;
  width: auto;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(${({ theme }) => theme.colors.primary}, 0.2);
  }
`;

const SignUpButton = styled(ButtonStyle)`
  width: 100%;
`;

const EmailAuthContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const EmailAuthInput = styled(Input)`
  flex-grow: 1;
  margin-right: ${({ theme }) => theme.spacing['2']};
  width: auto;
`;

const EmailAuthButton = styled(ButtonStyle)`
  height: 44px;
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.gray['600']};
  border-color: ${({ theme }) => theme.colors.gray['600']};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['700']};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray['400']};
    border-color: ${({ theme }) => theme.colors.gray['400']};
  }
`;

const AuthCodeInputGroup = styled(InputGroup)`
  display: flex;
  align-items: center;
  width: 100%;

  margin-bottom: ${({ theme }) => theme.spacing['4']};
  padding-left: 132px;
`;

const AuthCodeInput = styled(EmailAuthInput)``;

const VerifyAuthCodeButton = styled(EmailAuthButton)``;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.85em;
  margin-top: ${({ theme }) => theme.spacing['1']};
  margin-left: 140px;
  text-align: left;
  width: calc(100% - 120px);
  box-sizing: border-box;
  position: relative;
  flex-basis: 100%;
`;

const TermsAndConditionsGroup = styled.div`
  width: 100%;
  max-width: 480px;
  margin-top: ${({ theme }) => theme.spacing['6']};
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  text-align: left;
`;

const TermLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;
`;

const TermCheckbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing['2']};
  min-width: 16px;
  min-height: 16px;
  vertical-align: middle;
`;

const TermLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-left: ${({ theme }) => theme.spacing['1']};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const TermsContent = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: ${({ theme }) => theme.spacing['3']};
  padding: 0 ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.5;
  max-height: ${(props) => (props.$isOpen ? '200px' : '0')};
  overflow-y: auto;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.$isOpen ? 0 : '-10px')});
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0.3s ease;
`;

const EmailMessage = styled(ErrorMessage)`
  color: ${({ theme, $isSuccess }) => ($isSuccess ? theme.colors.success : theme.colors.danger)};
  margin-left: 8px;
`;
