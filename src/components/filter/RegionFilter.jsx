import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '/src/styles/theme.js';

const StyledButton = styled.button`
  min-width: 50px;
  height: 48px;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  margin: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  transition: all 0.2s ease-in-out;
  box-shadow: ${theme.shadows.base};

  background-color: ${(props) => (props.selected ? theme.colors.secondary : theme.colors.white)};
  color: ${(props) => (props.selected ? theme.colors.white : theme.colors.black)};
  border: 1px solid ${(props) => (props.selected ? theme.colors.secondary : theme.colors.gray[300])};

  &:hover {
    box-shadow: ${theme.shadows.sm};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  max-width: ${theme.width.lg};
  margin: ${theme.spacing[8]} auto;
  box-shadow: ${theme.shadows.lg};
`;

const RegionFilterComponent = () => {
  const regions = ['전체', '서울', '경기도', '인천', '강원도', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  const [selectedRegion, setSelectedRegion] = useState('전체');

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    console.log(`Selected region: ${region}`);
  };

  return (
    <FilterContainer>
      {regions.map((region) => (
        <StyledButton key={region} selected={selectedRegion === region} onClick={() => handleRegionClick(region)}>
          {region}
        </StyledButton>
      ))}
    </FilterContainer>
  );
};

export default RegionFilterComponent;
