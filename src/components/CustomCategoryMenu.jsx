import React from 'react';
import styled, { css } from 'styled-components';

// CommunityCategoryMenu 컴포넌트 정의
function CustomCategoryMenu({ selectedCategory, onSelectCategory, categories }) {
  return (
    <MenuContainer>
      {categories.map((category) => (
        <MenuItem
          key={category.name}
          isSelected={selectedCategory === category.name}
          onClick={() => onSelectCategory(category.name)}
        >
          {category.name}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default CustomCategoryMenu;

// 스타일 컴포넌트 정의
const MenuContainer = styled.div`
  width: 220px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[800]};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #e0f2fe;
      color: ${({ theme }) => theme.colors.button};
      font-weight: ${({ theme }) => theme.fontWeights.bold};
    `}
`;
