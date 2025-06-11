import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[500]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 80px;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  &::after {
    content: '▼';
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-left: ${({ theme }) => theme.spacing[1.5]};
    color: ${({ theme }) => theme.colors.gray[700]};
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.2s ease-in-out;
  }

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    width: 100%;
    min-width: unset;
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  list-style: none;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  margin: ${({ theme }) => theme.spacing[1]} 0 0 0;
  min-width: 100%;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const DropdownItem = styled.li`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export function DropdownFilterButton({ label, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <FilterButton onClick={() => setIsOpen((prev) => !prev)} $isOpen={isOpen} ref={dropdownRef}>
      {label}
      {isOpen && (
        <DropdownMenu>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => handleItemClick(option.value)}>
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </FilterButton>
  );
}

const SearchFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: ${({ theme }) => theme.width.xs};
  padding: ${({ theme }) => theme.spacing[4]} 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.width.lg}) {
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} 0;
  }

  @media (max-width: ${({ theme }) => theme.width.md}) {
    flex-direction: column;
    align-items: stretch;
    padding: ${({ theme }) => theme.spacing[2]} 0;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  width: 280px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
`;

const SearchIcon = styled(FaSearch)`
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-right: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-left: ${({ theme }) => theme.spacing[2]};

  @media (max-width: ${({ theme }) => theme.width.md}) {
    margin-left: 0;
    margin-top: ${({ theme }) => theme.spacing[2]};
    width: 90%;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export default function BasicFilter({ filterOptions, onFilterChange }) {
  const handleSearchChange = (event) => {
    if (onFilterChange) {
      onFilterChange('search', event.target.value);
    }
  };

  return (
    <SearchFilterContainer>
      <SearchInputWrapper>
        <SearchIcon />
        <SearchInput type="text" placeholder="이름 검색" onChange={handleSearchChange} />
      </SearchInputWrapper>
      <FilterWrapper>
        {filterOptions.map((filter, index) => (
          <DropdownFilterButton
            key={index}
            label={filter.label}
            options={filter.options}
            onSelect={(value) => onFilterChange(filter.key, value)}
          />
        ))}
      </FilterWrapper>
    </SearchFilterContainer>
  );
}
