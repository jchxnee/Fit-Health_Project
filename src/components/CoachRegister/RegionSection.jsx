import React, { useState } from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 12px;
  gap: 120px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
  margin-bottom: 12px;
`;
const Row = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const Select = styled.select`
  padding: 8px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
`;
const SearchIcon = styled.span`
  font-size: 20px;
  color: #888;
  cursor: pointer;
`;

const cities = ["서울시", "경기도", "부산시"];
const districts = {
  "서울시": ["강남구", "종로구", "서초구"],
  "경기도": ["성남시", "수원시", "고양시"],
  "부산시": ["해운대구", "수영구", "동래구"]
};

function RegionSection() {
  const [city, setCity] = useState("서울시");
  const [district, setDistrict] = useState("강남구");
  return (
    <Section>
      <Label>희망지역</Label>
      <Row>
        <Select value={city} onChange={e => {
          setCity(e.target.value);
          setDistrict(districts[e.target.value][0]);
        }}>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={district} onChange={e => setDistrict(e.target.value)}>
          {districts[city].map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
        <SearchIcon>🔍</SearchIcon>
      </Row>
    </Section>
  );
}

export default RegionSection; 