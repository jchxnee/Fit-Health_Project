import React from 'react';
import styled from 'styled-components';
import headerIcon from '../assets/header_icon.png';

function Header() {
  return (
    <Box>
      <Content>
        <HeaderLeft>
          <HeaderIcon src={headerIcon} alt="icon" />
          <HeaderNav>
            <span>핏코치 매칭</span>
            <span>추천 운동</span>
            <span>커뮤니티</span>
            <span>공지사항</span>
          </HeaderNav>
        </HeaderLeft>
        <HeaderRight>로그인/회원가입</HeaderRight>
      </Content>
    </Box>
  );
}

// Styled Components
const Box = styled.div`
  position: relative;
  width: 100%;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 1px 0 #ebebeb;
`;

const HeaderBg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const Content = styled.div`
  width: 970px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  @media (max-width: 900px) {
    width: 100%;
    padding: 0 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const HeaderIcon = styled.img`
  width: 124px;
  height: 24px;
`;

const HeaderNav = styled.nav`
  display: flex;
  gap: 21px;
  font-size: 19px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 400;

  span {
    cursor: pointer;
  }
`;

const HeaderRight = styled.div`
  font-size: 19px;
  color: #3d4149;
  font-weight: 400;
`;

export default Header;
