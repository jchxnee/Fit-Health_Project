import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const SubMenuContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: ${theme.spacing[4]};
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
  max-height: ${(props) => (props.$isOpen ? '500px' : '0')};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: translateY(${(props) => (props.$isOpen ? '0' : '-10px')});
  transition: all 0.3s ease-in-out;

  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};

  position: absolute;
  background-color: ${theme.colors.white};
  min-width: 135px;
  box-shadow: ${theme.shadows.md};
  z-index: 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  margin-top: ${theme.spacing[2]};
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

function DietCategoryMenu({ categories, selectedSubCategory, onSelectSubCategory }) {
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

export default DietCategoryMenu;
