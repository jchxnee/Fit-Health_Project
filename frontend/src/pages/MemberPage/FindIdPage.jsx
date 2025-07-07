import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { toast } from 'react-toastify';
import { memberService } from '../../api/member';
import { useNavigate } from 'react-router-dom';

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
      const userId = await memberService.findId(name, phone);

      if (userId) {
        setUserId(userId); // 아이디 찾기 성공 시 상태 저장
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
    const masked = '*'.repeat(3); // 뒤 4자리 마스킹
    return `${visible}${masked}@${domain}`;
  };

  return (
    <PageContainer>
      <FindIdBox>
        {!userId ? (
          <>
            <Title>아이디 찾기</Title>
            <InputField type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField
              type="tel"
              placeholder="전화번호('-' 없이 11자리 입력)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <SubmitButton onClick={handleFindId}>아이디 찾기</SubmitButton>
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

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #fdfafa;
  align-items: center;
  width: 100%;
`;

const FindIdBox = styled.div`
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

const ResultButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
`;

const ResultButton = styled(ButtonStyle)`
  padding: 12px 10px;
  font-size: 18px;
  font-weight: 500;
  flex: 1;
  min-width: 120px;
`;

const ResultBox = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  width: 100%;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Notice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FoundId = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;
