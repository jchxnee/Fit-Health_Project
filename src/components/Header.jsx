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

const Box = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Content = styled.div`
  width: 970px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap:  ${({ theme }) => theme.spacing[10]};
`;

const HeaderIcon = styled.img`
  width: 124px;
  height: 24px;
`;

const HeaderNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};

  span {
    cursor: pointer;
  }
`;

const HeaderRight = styled.div`
  font-size:  ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  cursor: pointer;
`;

export default Header;
