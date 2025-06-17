import React, { useState } from 'react';
import styled from 'styled-components';

const SelectBarContainer = styled.div`
  display: flex;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
`;

const SelectBarItem = styled.div`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.gray[900] : theme.colors.gray[500])};
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray[900]};
  `}
`;

export default function SelectBar({ options, onSelect, initialSelected }) {
  const [selectedItem, setSelectedItem] = useState(initialSelected || (options.length > 0 ? options[0].value : null));

  const handleItemClick = (value) => {
    setSelectedItem(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <SelectBarContainer>
      {options.map((option, index) => (
        <SelectBarItem
          key={index}
          onClick={() => handleItemClick(option.value)}
          $isActive={selectedItem === option.value}
        >
          {option.label}
        </SelectBarItem>
      ))}
    </SelectBarContainer>
  );
}
