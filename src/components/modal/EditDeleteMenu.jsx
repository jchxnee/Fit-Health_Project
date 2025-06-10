import React from 'react';
import styled from 'styled-components';

function EditDeleteMenu() {
  const menuItems = [
    { name: '수정', action: () => console.log('수정 클릭') },
    { name: '삭제', action: () => console.log('삭제 클릭') },
  ];

  return (
    <MenuContainer>
      {menuItems.map((item) => (
        <MenuItem key={item.name} onClick={item.action}>
          {item.name}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default EditDeleteMenu;

const MenuContainer = styled.div`
  width: 107px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing['2']};
`;

const MenuItem = styled.div`
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  width: 100%;
  text-align: center;
`;
