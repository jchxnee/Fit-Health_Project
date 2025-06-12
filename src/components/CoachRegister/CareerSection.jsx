import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
`;
const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
`;
const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #888;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const ExampleBox = styled.div`
  background: #f5f5f5;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 15px;
  color: #222;
  margin-bottom: 12px;
  display: inline-block;
`;

function CareerSection() {
  return (
    <Section>
      <TopRow>
        <Label>경력 등록</Label>
        <AddButton type="button">+</AddButton>
      </TopRow>
      <ExampleBox>
        EX) 국가공인 생활스포츠지도사 자격 보유 (생활체육지도사 2급 - 보디빌딩)
      </ExampleBox>
      <ExampleBox>
        EX) 재활 및 체형교정 전문 교육 수료 (CES KOREA 재활 트레이닝 과정 이수)
      </ExampleBox>
    </Section>
  );
}

export default CareerSection; 