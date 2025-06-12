import React, { useState } from "react";
import styled from "styled-components";
import RegionSelect from "../RegionSelect.jsx";

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  gap: 120px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
`;
const Row = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

function RegionSection() {
  return (
    <Section>
      <Label>희망지역</Label>
      <Row>
        <RegionSelect classname="Select"/>
      </Row>
    </Section>
  );
}

export default RegionSection; 