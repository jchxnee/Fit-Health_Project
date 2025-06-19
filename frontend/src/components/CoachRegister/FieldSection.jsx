import React from "react";
import styled from "styled-components";

const Section = styled.section`
    padding: 0 12px;
  width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 120px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 60px;
`;
const FieldButton = styled.button`
  padding: 10px 50px;
  border: 1.5px solid #2563eb;
  border-radius: 30px;
  background: ${({ selected }) => (selected ? '#2563eb' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#2563eb')};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
`;

const fields = ["헬스", "요가", "도수", "재활"];

function FieldSection({ majorName, setMajorName }) {
  return (
    <Section>
      <Label>희망분야</Label>
      <ButtonRow>
        {fields.map((field) => (
          <FieldButton
            key={field}
            selected={majorName === field}
            type="button"
            onClick={() => setMajorName(field)}
          >
            {field}
          </FieldButton>
        ))}
      </ButtonRow>
    </Section>
  );
}

export default FieldSection; 