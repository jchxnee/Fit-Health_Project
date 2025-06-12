import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
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

function IntroSection() {
  return (
    <Section>
      <Label>인삿말 / 한 줄 소개</Label>
      <Textarea placeholder="예) 안녕하세요. 김성은 트레이너입니다! 여러분들의 몸과 마음을 건강하게 만들어드리겠습니다! 믿어 보실?" />
    </Section>
  );
}

export default IntroSection; 