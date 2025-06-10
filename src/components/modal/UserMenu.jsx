import React from 'react';
import styled from 'styled-components';
import { FaSyncAlt } from 'react-icons/fa';

function UserMenu() {
  const menuItems = [
    { name: '마이페이지', action: () => console.log('마이페이지 클릭') },
    { name: '신청 내역', action: () => console.log('신청 내역 클릭') },
    {
      name: '핏코치 등록',
      icon: <StyledFaSyncAlt />,
      action: () => console.log('핏코치 등록 클릭'),
    },
    { name: '로그아웃', action: () => console.log('로그아웃 클릭') },
  ];

  return (
    <MenuContainer>
      {menuItems.map((item) => (
        <MenuItem key={item.name} onClick={item.action}>
          {item.name}
          {item.icon && item.icon}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default UserMenu;

const StyledFaSyncAlt = styled(FaSyncAlt)`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const MenuContainer = styled.div`
  width: 173px;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
