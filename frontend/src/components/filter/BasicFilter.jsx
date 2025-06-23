import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import theme from '/src/styles/theme.js'; // theme import 추가

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  outline: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: ${({ theme }) => theme.spacing[20]};
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

// DropdownFilterButton에 currentSelectedValue prop 추가
export function DropdownFilterButton({ label, options, onSelect, currentSelectedValue }) {
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

  // 현재 선택된 값에 해당하는 label을 찾아서 버튼에 표시
  const displayLabel = options.find((option) => option.value === currentSelectedValue)?.label || label;

  return (
    <FilterButton onClick={() => setIsOpen((prev) => !prev)} $isOpen={isOpen} ref={dropdownRef}>
      {displayLabel} {/* 현재 선택된 값 또는 기본 label 표시 */}
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

// BasicFilter 컴포넌트에 currentSearch, currentStatus prop 추가
export default function BasicFilter({ filterOptions, onFilterChange, currentSearch, currentStatus }) {
  const handleSearchChange = (event) => {
    // BasicFilter 내부에서 직접 검색어 상태를 관리하지 않고, 부모로부터 받은 onFilterChange 호출
    onFilterChange('search', event.target.value);
  };

  return (
    <SearchFilterContainer>
      <SearchInputWrapper>
        <SearchIcon />
        <SearchInput type="text" placeholder="이름 검색" onChange={handleSearchChange} value={currentSearch} />
      </SearchInputWrapper>
      <FilterWrapper>
        {filterOptions.map((filter, index) => (
          <DropdownFilterButton
            key={index}
            label={filter.label}
            options={filter.options}
            onSelect={(value) => onFilterChange(filter.key, value)}
            // 필터의 key에 따라 적절한 현재 선택된 값을 전달
            currentSelectedValue={filter.key === 'status' ? currentStatus : undefined}
          />
        ))}
      </FilterWrapper>
    </SearchFilterContainer>
  );
}
