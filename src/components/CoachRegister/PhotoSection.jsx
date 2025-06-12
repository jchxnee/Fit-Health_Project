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
const PhotoRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
`;
const PhotoBox = styled.div`
  width: 120px;
  height: 120px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;
const Plus = styled.span`
  font-size: 40px;
  color: #bbb;
`;

function PhotoSection() {
  return (
    <Section>
      <TopRow>
        <Label>사진 등록(자격증 및 프로필)</Label>
        <AddButton type="button">+</AddButton>
      </TopRow>
      <PhotoRow>
        {[0,1,2,3].map(i => (
          <PhotoBox key={i}>
            <Plus>+</Plus>
          </PhotoBox>
        ))}
      </PhotoRow>
    </Section>
  );
}

export default PhotoSection; 