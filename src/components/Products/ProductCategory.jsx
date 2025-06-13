import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import theme from '../../styles/theme';

function ProductCategory({ onCategorySelect, initialCategory }) {
  const categories = [
    { name: '전체', key: 'all' },
    { name: '건강기능식품', key: 'health-supplements' },
    { name: '홈트레이닝', key: 'home-training' },
    { name: '운동보조제 / 단백질', key: 'meal-replacement' },
    { name: '건강 간편식 / 다이어트 식품', key: 'diet-food' },
  ];

  const [selectedKey, setSelectedKey] = useState(initialCategory || 'all');

  useEffect(() => {
    setSelectedKey(initialCategory || 'all');
  }, [initialCategory]);

  const handleCategoryClick = (categoryKey) => {
    setSelectedKey(categoryKey);
    if (onCategorySelect) {
      onCategorySelect(categoryKey);
    }
  };

  return (
    <MenuContainer>
      {categories.map((category) => (
        <MenuItem
          key={category.key}
          isSelected={selectedKey === category.key}
          onClick={() => handleCategoryClick(category.key)}
        >
          {category.name}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default ProductCategory;

const MenuContainer = styled.div`
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
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[800]};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #e0f2fe;
      color: ${({ theme }) => theme.colors.button};
      font-weight: ${({ theme }) => theme.fontWeights.bold}; // ✅ 선택 시 강조
    `}
`;
