import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const SubMenuContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: ${theme.spacing[4]}; /* 루틴 추천받기 버튼과의 간격 */
`;

const DropdownButton = styled.button`
  background-color: ${theme.colors.gray300};
  color: ${theme.colors.black};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  border: 1px solid ${theme.colors.gray400};
  border-radius: ${theme.borderRadius.md};
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  &:hover {
    background-color: ${theme.colors.gray400};
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: ${theme.colors.white};
  min-width: 85px;
  box-shadow: ${theme.shadows.md};
  z-index: 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  margin-top: ${theme.spacing[2]};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: translateY(${(props) => (props.$isOpen ? '0' : '-5px')});
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
`;

const DropdownItem = styled.div`
  color: ${theme.colors.black};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  text-decoration: none;
  display: block;
  font-size: ${theme.fontSizes.md};
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: ${theme.colors.gray100};
    cursor: pointer;
  }
`;

function SubCategoryMenu({ categories, selectedSubCategory, onSelectSubCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (category) => {
    onSelectSubCategory(category);
    setIsOpen(false);
  };

  return (
    <SubMenuContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedSubCategory || '카테고리 선택'}
        <span>{isOpen ? '▲' : '▼'}</span>
      </DropdownButton>
      <DropdownContent $isOpen={isOpen}>
        {categories.map((category) => (
          <DropdownItem key={category} onClick={() => handleItemClick(category)}>
            {category}
          </DropdownItem>
        ))}
      </DropdownContent>
    </SubMenuContainer>
  );
}

export default SubCategoryMenu;
