import React from 'react';
import styled, { css } from 'styled-components';

// CategoryMenu 컴포넌트 수정
// props로 selectedCategory와 onSelectCategory를 받도록 변경
function CategoryMenu({ selectedCategory, onSelectCategory }) {
  const categories = [{ name: '전체' }, { name: '헬스' }, { name: '요가' }, { name: '도수' }, { name: '재활' }];

  return (
    <MenuContainer>
      {categories.map((category) => (
        <MenuItem
          key={category.name}
          isSelected={selectedCategory === category.name}
          onClick={() => onSelectCategory(category.name)} // 클릭 시 props 함수 호출
        >
          {category.name}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default CategoryMenu;

// 스타일 코드는 동일합니다.
const MenuContainer = styled.div`
  width: 190px;
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
