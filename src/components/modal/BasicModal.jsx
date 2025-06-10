import React from 'react';
import styled from 'styled-components';

function BasicModal({ menuItems }) {
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

export default BasicModal;

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
  padding: ${({ theme }) => theme.spacing[2]} 0;
  text-align: center;
`;
