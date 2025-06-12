import React from 'react';
import styled from 'styled-components';
import headerIcon from '../assets/header_icon.png';
import { FaBell } from 'react-icons/fa';

function Header(user) {
  return (
    <HeaderComponent>
      <HeaderContent>
        <HeaderLeft>
          <HeaderIcon src={headerIcon} alt="icon" />
          <HeaderNavLeft>
            <span>핏코치 매칭</span>
            <span>추천 운동</span>
            <span>커뮤니티</span>
            <span>공지사항</span>
          </HeaderNavLeft>
        </HeaderLeft>
        {user !== null ? (
          <HeaderRight>
            <HeaderNavRight>
              <FaBell />
              <span>채팅</span>
              <ProfileImg src={user.img} alt="profileIcon" />
              <span>{user.name}님</span>
            </HeaderNavRight>
          </HeaderRight>
        ) : (
          <HeaderRight>로그인/회원가입</HeaderRight>
        )}
      </HeaderContent>
    </HeaderComponent>
  );
}

const HeaderComponent = styled.header`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: ${({ theme }) => theme.zIndices.sticky};
  position: sticky;
  top: 0;
`;

const HeaderContent = styled.div`
  width: ${({ theme }) => theme.width.lg}; /* 1008px */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[10]};
`;

const HeaderIcon = styled.img`
  width: 124px;
  height: ${({ theme }) => theme.spacing[6]};
`;

const HeaderNavLeft = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};

  span {
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.button};
    }
  }
`;

const HeaderRight = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const HeaderNavRight = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  align-items: center; /* 아이콘 및 텍스트 세로 중앙 정렬 */

  span {
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.button};
    }
  }
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;
export default Header;
