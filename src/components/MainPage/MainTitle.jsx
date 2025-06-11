import React from 'react';
import styled from "styled-components";

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 100px 0 0 0;
  background: #fff;
`;
const Title = styled.h1`
  font-family: 'SUITE', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: #3D4149;
`;

const MainTitle = () => (
    <Wrapper>
        <Title>당신의 건강 파트너, 전문코치와 함께</Title>
    </Wrapper>
);

export default MainTitle;