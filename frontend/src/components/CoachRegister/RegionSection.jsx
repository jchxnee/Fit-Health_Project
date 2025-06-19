import React from 'react';
import styled from 'styled-components';
import RegionSelect from '../RegionSelect.jsx';

const Section = styled.section`
    width: 100%;
    padding: 0 12px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 120px;
    justify-content: center;
    @media (max-width: 200px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
`;

const Label = styled.div`
    font-weight: 600;
    font-size: 18px;
    color: #222;
    width: 90px;
`;

function RegionSection({ wishArea, setWishArea }) {
  // wishArea는 '시/도 구/군' 형태의 문자열로 저장
  const handleRegionChange = (province, city) => {
    if (province && city) setWishArea(`${province} ${city}`);
    else if (province) setWishArea(province);
    else setWishArea('');
  };

  return (
    <Section>
      <Row>
        <Label>희망지역</Label>
        <RegionSelect value={wishArea} onChange={handleRegionChange} />
      </Row>
    </Section>
  );
}

export default RegionSection;