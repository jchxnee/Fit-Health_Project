import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
const SubmitButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.08);
  transition: background 0.2s;
  &:hover {
    background: #1746b3;
  }
`;

function SubmitSection() {
  return (
    <Row>
      <SubmitButton type="submit">등록하기</SubmitButton>
    </Row>
  );
}

export default SubmitSection; 