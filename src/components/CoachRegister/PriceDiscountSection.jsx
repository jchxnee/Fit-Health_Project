import React from "react";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
    padding: 0 12px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 20px;
  align-self: flex-start;
  margin-bottom: 16px;
`;
const Notice = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom:30px;
  align-self: flex-start;
`;
const TableHeaderRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 8px;
`;
const TableHeader = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #3D4149;
  padding: 10px 0;
  width: 120px;
  text-align: center;
`;
const TableRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-end;
`;
const PriceInput = styled.input`
  border: none;
  border-bottom: 1.5px solid #d1d5db;
  border-radius: 0;
  padding: 0 0 2px 0;
  height: 36px;
  font-size: 16px;
  width: 120px;
  background: transparent;
  outline: none;
  text-align: center;
`;

function PriceDiscountSection() {
  return (
    <Section>
      <Label>희망금액 및 할인율</Label>
      <Notice>※ 핏코치께서 입력해주신 1회 금액에 따라 설정하신 할인율이 적용됩니다.</Notice>
      <TableHeaderRow>
        <TableHeader>희망 1회 금액</TableHeader>
        <TableHeader>3회 이상</TableHeader>
        <TableHeader>5회 이상</TableHeader>
        <TableHeader>10회 이상</TableHeader>
      </TableHeaderRow>
      <TableRow>
        <PriceInput type="text" placeholder="50,000원" />
        <PriceInput type="text" placeholder="3%" />
        <PriceInput type="text" placeholder="5%" />
        <PriceInput type="text" placeholder="10%" />
      </TableRow>
    </Section>
  );
}

export default PriceDiscountSection; 