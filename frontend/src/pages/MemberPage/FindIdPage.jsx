import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { toast } from 'react-toastify';
import { memberService } from '../../api/member';
import { useNavigate } from 'react-router-dom';
import theme from '../../styles/theme'; // theme 임포트

const FindIdPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleFindId = async () => {
    if (!name || !phone) {
      toast.warning('이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    try {
      const foundUserId = await memberService.findId(name, phone); // userId 변수명 충돌 피하기

      if (foundUserId) {
        setUserId(foundUserId); // 아이디 찾기 성공 시 상태 저장
      } else {
        toast.error('일치하는 회원 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      toast.error('일치하는 회원 정보를 찾을 수 없습니다.');
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [id, domain] = email.split('@');

    if (id.length <= 4) {
      // id가 4글자 이하인 경우 전체 마스킹 처리
      return `${'*'.repeat(id.length)}@${domain}`;
    }

    const visible = id.slice(0, id.length - 3); // 앞 부분 그대로
    const masked = '*'.repeat(3); // 뒤 3자리 마스킹 (원래 4자리였으나, 예시 이미지 기준 3자리 마스킹으로 보임)
    return `${visible}${masked}@${domain}`;
  };

  return (
    <PageContainer>
      <FindIdBox>
        {!userId ? (
          <>
            <Title>아이디 찾기</Title>
            {/* 이름 입력 필드 */}
            <InputContainer $hasValue={name.length > 0}>
              <InputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="" /* placeholder가 있어야 :not(:placeholder-shown) 셀렉터가 작동 */
              />
              <Label htmlFor="name">이름</Label>
            </InputContainer>

            {/* 전화번호 입력 필드 */}
            <InputContainer $hasValue={phone.length > 0}>
              <InputField
                type="tel"
                id="phone"
                placeholder="" /* placeholder가 있어야 :not(:placeholder-shown) 셀렉터가 작동 */
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Label htmlFor="phone">전화번호('-' 없이 11자리 입력)</Label>
            </InputContainer>

            <StyledButton onClick={handleFindId}>아이디 찾기</StyledButton>
            <LinkContainer>
              <StyledLink href="/signup">회원가입하기</StyledLink>
              <StyledLink href="/login">로그인하기</StyledLink>
            </LinkContainer>
          </>
        ) : (
          <>
            <Title>아이디 찾기</Title>
            <ResultBox>
              <Notice>검색결과 아이디는 아래와 같습니다.</Notice>
              <FoundId>{maskEmail(userId)}</FoundId>
            </ResultBox>
            <ResultButtonContainer>
              <ResultButton onClick={() => navigate('/login')}>로그인</ResultButton>
              <ResultButton onClick={() => navigate('/findPwd')}>비밀번호 찾기</ResultButton>
            </ResultButtonContainer>
          </>
        )}
      </FindIdBox>
    </PageContainer>
  );
};

export default FindIdPage;

// --- 스타일 컴포넌트 ---
// FindPwdPage에서 가져온 스타일을 그대로 사용

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 기존 findPwdPage와 동일하게 flex-start로 변경 */
  min-height: 100vh;
  padding-top: ${theme.spacing[24]}; /* 기존 findPwdPage와 동일하게 padding-top 추가 */
  background-color: #fdfafa;
  width: 100%;
`;

const FindIdBox = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[10]}; /* 기존 findPwdPage와 동일한 패딩 */
  border-radius: ${theme.borderRadius.xl}; /* 기존 findPwdPage와 동일한 border-radius */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); /* 기존 findPwdPage와 동일한 그림자 */
  width: 100%;
  max-width: 420px; /* 기존 findPwdPage와 동일한 최대 너비 */
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto; /* 기존 findPwdPage와 동일하게 auto로 변경 */
  justify-content: flex-start; /* 기존 findPwdPage와 동일하게 flex-start로 변경 */
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes['3xl']}; /* 기존 findPwdPage와 동일한 폰트 사이즈 */
  font-weight: ${theme.fontWeights.bold}; /* 기존 findPwdPage와 동일한 폰트 굵기 */
  color: ${theme.colors.gray[900]}; /* 기존 findPwdPage와 동일한 색상 */
  margin-bottom: ${theme.spacing[10]}; /* 기존 findPwdPage와 동일한 마진 */
  text-align: center;
`;

// 이름, 전화번호 필드를 위한 InputContainer (플로팅 라벨용)
const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${theme.spacing[8]}; /* 기존 findPwdPage와 동일한 마진 */

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

// 이름, 전화번호 필드를 위한 Label (플로팅 라벨용)
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

// 이름, 전화번호 필드를 위한 InputField (플로팅 라벨용 패딩 및 스타일)
const InputField = styled.input`
  width: 100%;
  padding: ${theme.spacing[4]} ${theme.spacing[4]}; /* 상하 16px, 좌우 16px */
  border: 1px solid ${({ theme }) => theme.colors.gray[300]}; /* $error prop 제거 */
  border-radius: ${theme.borderRadius.lg}; /* 기존 findPwdPage와 동일한 border-radius */
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

// 기존 SubmitButton을 StyledButton으로 변경
const StyledButton = styled(ButtonStyle)`
  width: 100%;
  margin-top: ${theme.spacing[2]}; /* 기존 FindIdPage와 동일 */
  height: 56px; /* EmailAuthButton과 동일한 높이 */
  font-size: ${theme.fontSizes.base}; /* 기존 FindIdPage의 SubmitButton 폰트 사이즈 */
  background-color: ${theme.colors.button}; /* EmailAuthButton과 동일한 색상 */
  border-color: ${theme.colors.button};
  border-radius: ${theme.borderRadius.lg};

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center; /* 중앙 정렬로 변경 */
  gap: ${theme.spacing[6]}; /* 간격 추가 */
  width: 100%;
  margin-top: ${theme.spacing[8]}; /* 기존 FindPwdPage와 동일한 마진 */
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

const ResultButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  width: 100%;
  margin-top: ${theme.spacing[8]}; /* 결과 버튼 컨테이너 상단 마진 추가 */
`;

const ResultButton = styled(ButtonStyle)`
  padding: 12px 10px;
  font-size: 18px;
  font-weight: 500;
  flex: 1;
  min-width: 120px;
  background-color: ${theme.colors.button}; /* 버튼 스타일 통일 */
  border-color: ${theme.colors.button};
  border-radius: ${theme.borderRadius.lg};

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const ResultBox = styled.div`
  background-color: ${theme.colors.gray[100]};
  padding: ${theme.spacing[8]};
  border-radius: ${theme.borderRadius.base};
  width: 100%;
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const Notice = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[6]};
`;

const FoundId = styled.div`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;
