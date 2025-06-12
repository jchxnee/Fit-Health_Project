import React, { useState } from 'react';
import * as S from '../styles/common/Login';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <S.LoginContainer>
      <S.LoginTitle>로그인</S.LoginTitle>
      <S.LoginFormBox>
        <S.InputGroup>
          <S.StyledLabel htmlFor="username">아이디</S.StyledLabel>
          <S.StyledInput
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.StyledLabel htmlFor="password">비밀번호</S.StyledLabel>
          <S.StyledInput
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </S.InputGroup>

        {/* Only the "아이디 저장" checkbox div here, ABOVE LoginButton */}
        <S.LoginRememberMeOption>
          <input type="checkbox" id="remember-me" />
          <label htmlFor="remember-me">아이디저장</label>
        </S.LoginRememberMeOption>

        <S.LoginButton>로그인</S.LoginButton>

        {/* LoginLinksContainer is moved back BELOW LoginButton */}
        <S.LoginLinksContainer>
          <S.OptionLink href="#">아이디 찾기</S.OptionLink>
          <S.LinkSeparator>|</S.LinkSeparator>
          <S.OptionLink href="#">비밀번호 찾기</S.OptionLink>
          <S.LinkSeparator>|</S.LinkSeparator>
          <S.OptionLink href="#">회원가입</S.OptionLink>
        </S.LoginLinksContainer>

        <S.SNSLoginDivider>
          <span>SNS 계정으로 로그인</span>
        </S.SNSLoginDivider>
        <S.SNSLoginIcons>
          <S.SNSIcon src="/public/img/kakaotalk.png" alt="Kakao Login" />
          <S.SNSIcon src="/public/img/naver.png" alt="Naver Login" />
          <S.SNSIcon src="/public/img/google.png" alt="Google Login" />
        </S.SNSLoginIcons>
      </S.LoginFormBox>
    </S.LoginContainer>
  );
}

export default LoginPage;
