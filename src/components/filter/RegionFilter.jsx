import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '/src/styles/theme.js';

const StyledButton = styled.button`
  min-width: 50px;
  height: ${({ theme }) => theme.spacing[12]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  margin: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  transition: all 0.2s ease-in-out;

  background-color: ${(props) => (props.selected ? theme.colors.skyblue : theme.colors.white)};
  color: ${(props) => (props.selected ? theme.colors.black : theme.colors.black)};
  border: 1px solid ${(props) => (props.selected ? theme.colors.skyblue : theme.colors.gray[300])};

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
  padding: ${theme.spacing[2]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  max-width: ${theme.width.lg};

  ${StyledButton} {
    flex-basis: calc(100% / 6 - ${theme.spacing[2]} * 2);
    max-width: calc(100% / 6 - ${theme.spacing[2]} * 2);
    min-width: unset;

    &:nth-child(6n) {
      margin-right: 0;
    }
  }

  @media (max-width: ${theme.width.md}) {
    ${StyledButton} {
      flex-basis: calc(100% / 3 - ${theme.spacing[2]} * 2);
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  @media (max-width: ${theme.width.sm}) {
    ${StyledButton} {
      flex-basis: calc(100% / 2 - ${theme.spacing[2]} * 2);
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
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
