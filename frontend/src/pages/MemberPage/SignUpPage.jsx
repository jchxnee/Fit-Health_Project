import React, { useState } from 'react';
import styled from 'styled-components';
import logoSrc from '../../assets/header_icon.png';
import ButtonStyle from '../../styles/common/Button';
import { useNavigate } from 'react-router-dom';
import { useSignUpForm } from '../../hooks/useSignUpForm';

function SignUpPage() {
  const { register, handleSubmit, errors, isSubmitting } = useSignUpForm();
  const navigate = useNavigate();

  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [birthdate, setBirthdate] = useState('');

  // 약관 내용 토글 상태
  const [showServiceTerms, setShowServiceTerms] = useState(false);
  const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');

  const onSubmitHandler = (data) => {
    if (!agreeService || !agreePrivacy) {
      alert('필수 약관에 모두 동의해야 회원가입을 할 수 있습니다.');
      return;
    }
    console.log('Form Data:', data);
  };

  const handleEmailAuthClick = () => {
    // 여기에 이메일 인증번호 발송 API 호출 로직을 추가할 수 있습니다.
    // 성공적으로 발송되었다고 가정하고 인증 코드 입력 필드를 표시합니다.
    setShowAuthCodeInput(true);
    alert('인증번호가 이메일로 발송되었습니다. 확인해주세요.');
  };

  const handleVerifyAuthCode = () => {
    // 여기에 인증 번호 확인 API 호출 로직을 추가할 수 있습니다.
    console.log('입력된 인증번호:', authCode);
    if (authCode === '123456') {
      // 예시: 실제로는 서버에서 확인
      alert('인증번호가 확인되었습니다!');
      // 인증 성공 시 추가 로직 (예: 이메일 필드 비활성화, 다음 단계 진행 등)
    } else {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  return (
    <SignupContainer>
      <LogoImage src={logoSrc} alt="FIT:HEALTH 로고" />
      <SignupForm onSubmit={handleSubmit}>
        <FormTitle>회원가입</FormTitle>

        <InputGroup>
          <Label htmlFor="email">이메일*</Label>
          <EmailAuthContainer>
            <EmailAuthInput
              type="email"
              id="email"
              placeholder="이메일 주소 입력"
              {...register('email')}
              $error={errors.email}
            />
            <EmailAuthButton type="button" onClick={handleEmailAuthClick}>
              이메일 인증
            </EmailAuthButton>
          </EmailAuthContainer>
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
            <VerifyAuthCodeButton type="button" onClick={handleVerifyAuthCode}>
              확인
            </VerifyAuthCodeButton>
          </AuthCodeInputGroup>
        )}
        {/* --- 여기까지 새로 추가된 부분 --- */}

        <InputGroup>
          <Label htmlFor="password">비밀번호*</Label>
          <Input
            type="password"
            id="password"
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

        <InputGroup>
          <Label htmlFor="username">이름*</Label>
          <Input type="text" id="username" placeholder="이름 입력" {...register('username')} $error={errors.username} />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
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
          <Label htmlFor="birthdate">생년월일</Label>
          <Input type="date" id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
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
  /* flex-direction: column;  // 이 부분 제거 */
  flex-wrap: wrap; /* 내용이 길어지면 다음 줄로 넘어가도록 설정 */
  align-items: flex-start; /* 라벨과 인풋의 시작점을 맞춤 */
  margin-bottom: ${({ theme }) => theme.spacing['4']}; /* 기본 하단 마진 */
  width: 100%;
  max-width: 480px;
  /* 에러가 있을 경우 하단 패딩을 추가하여 에러 메시지 공간을 확보 */
  padding-bottom: ${({ theme, $hasError }) => ($hasError ? theme.spacing['4'] : '0')};
  position: relative; /* 자식 요소의 절대 위치 지정을 위해 */

  /* 약관 동의 체크박스 그룹에서 사용 시 마진 조정 */
  &:has(label > input[type='checkbox']) {
    margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 체크박스 그룹은 마진을 조금 줄임 */
    padding-bottom: ${({ theme, $hasError }) => ($hasError ? theme.spacing['4'] : '0')};
  }
`;

const Label = styled.label`
  flex-basis: 120px; /* 라벨의 너비를 고정 */
  min-width: 120px; /* 최소 너비도 고정 */
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['700']};
  text-align: left; /* 텍스트 왼쪽 정렬 */
  margin-right: ${({ theme }) => theme.spacing['3']}; /* 라벨과 입력 필드 사이 간격 */
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  padding-top: ${({ theme }) => theme.spacing['3']}; /* 인풋 필드와 높이 맞추기 위해 패딩 추가 */
`;

const Input = styled.input`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 */
  padding: ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  box-sizing: border-box;
  width: auto; /* flex-grow가 있으므로 auto */
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
`;

const AuthCodeInputGroup = styled(Input)`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 480px; /* InputGroup과 동일한 최대 너비 */
  margin-top: ${({ theme }) => theme.spacing['3']}; /* 이메일 입력 그룹과의 간격 */
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  padding-left: 120px; /* 라벨 너비만큼 들여쓰기하여 이메일 인풋과 정렬 */
  box-sizing: border-box;
`;

const AuthCodeInput = styled(Input)`
  flex-grow: 1;
  margin-right: ${({ theme }) => theme.spacing['2']};
  width: auto;
`;

const VerifyAuthCodeButton = styled(ButtonStyle)`
  height: 44px;
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray['400']};
    border-color: ${({ theme }) => theme.colors.gray['400']};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.85em;
  margin-top: ${({ theme }) => theme.spacing['1']}; /* 위 요소와의 작은 간격 */
  margin-left: 140px; /* 라벨 너비만큼 들여쓰기하여 인풋 아래에 맞춤 */
  text-align: left;
  width: calc(100% - 120px); /* 라벨 너비만큼 제외하고 나머지 너비 사용 */
  box-sizing: border-box;
  position: relative; /* InputGroup 내에서 일반 흐름에 맞춤 */
  flex-basis: 100%; /* 새로운 줄로 내려가도록 강제 */
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
