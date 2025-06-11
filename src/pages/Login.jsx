import React, { useState } from 'react';
import * as S from '../styles/common/Login';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <S.LoginContainer>
      <S.LoginTitle>로그인</S.LoginTitle>
      <S.LoginFormBox>
        <S.InputGroup>
          {/* Label을 Input 위에 배치 */}
          <S.StyledLabel htmlFor="username">아이디</S.StyledLabel>
          <S.StyledInput
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // placeholder 속성 다시 사용
            // placeholder="아이디를 입력하세요"
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
            // placeholder="비밀번호를 입력하세요"
          />
        </S.InputGroup>
        <S.LoginButton>로그인</S.LoginButton>

        <S.LoginOptions>
          <div>
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">아이디저장</label>
          </div>
          <S.LoginLinksContainer>
            <S.OptionLink href="#">아이디 찾기</S.OptionLink>
            <S.LinkSeparator>|</S.LinkSeparator> {/* Separator */}
            <S.OptionLink href="#">비밀번호 찾기</S.OptionLink>
            <S.LinkSeparator>|</S.LinkSeparator> {/* Separator */}
            <S.OptionLink href="#">회원가입</S.OptionLink>
          </S.LoginLinksContainer>
        </S.LoginOptions>

        <S.SNSLoginDivider>
          <span>SNS 계정으로 로그인</span>
        </S.SNSLoginDivider>
        <S.SNSLoginIcons>
          <S.SNSIcon src="/public/img/kakaotalk.png" alt="Kakao Login" /> {/* Update path */}
          <S.SNSIcon src="/public/img/naver.png" alt="Naver Login" /> {/* Update path */}
          <S.SNSIcon src="/public/img/google.png" alt="Google Login" /> {/* Update path */}
        </S.SNSLoginIcons>
      </S.LoginFormBox>
    </S.LoginContainer>
  );
}

export default Login;
