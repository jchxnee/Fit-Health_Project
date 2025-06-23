import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    padding: 0 12px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
  margin-bottom: 12px;
`;
const Textarea = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1.5px solid #d1d5db;
  border-radius: 0;
  padding: 8px 0;
  font-size: 16px;
  background: transparent;
  outline: none;
  resize: none;
`;

function IntroSection({ value, onChange }) {
  return (
    <Section>
      <Label>인삿말 / 한 줄 소개</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예) 안녕하세요. 김성은 트레이너입니다!"
      />
    </Section>
  );
}


export default IntroSection;