import React, { useState } from "react";
import styled from "styled-components";

const Section = styled.section`
    padding: 0 12px;
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

const InputRow = styled.div`
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const RemoveButton = styled.button`
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
`;

function CareerSection({ careers, setCareers }) {
  const [input, setInput] = useState("");

  const handleAddCareer = () => {
    if (input.trim()) {
      setCareers([...careers, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (index) => {
    setCareers(careers.filter((_, i) => i !== index));
  };

  return (
    <Section>
      <TopRow>
        <Label>경력 등록</Label>
        <AddButton type="button" onClick={handleAddCareer}>+</AddButton>
      </TopRow>
      <InputRow>
        <Input
          type="text"
          placeholder="경력 내용을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </InputRow>
      {careers.map((career, idx) => (
        <InputRow key={idx}>
          <Input value={career} readOnly />
          <RemoveButton onClick={() => handleRemove(idx)}>삭제</RemoveButton>
        </InputRow>
      ))}
    </Section>
  );
}

export default CareerSection;
