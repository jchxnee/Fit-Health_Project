import React from "react";
import styled from "styled-components";
import { FaInstagram } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';

const Section = styled.section`
    width: 100%;
`;
const Row = styled.div`
    display: flex;
    gap: 32px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const SocialBox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconCircle = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 4px;
    ${({ type }) =>
            type === "kakao"
                    ? `
    background: #ffeb00;
    color: #191919;
    border: 1px solid #e0e0e0;
  `
                    : `
    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
    color: #fff;
  `}
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const IdInput = styled.input`
  border: none;
  border-bottom: 1.5px solid #d1d5db;
  border-radius: 0;
  padding: 0 0 2px 0;
  height: 36px;
  font-size: 16px;
  width: 160px;
  background: transparent;
  outline: none;
  text-align: left;
`;

function IdSection() {
    return (
        <Section>
            <Row>
                <SocialBox>
                    <IconCircle type="kakao"><RiKakaoTalkFill /></IconCircle>
                    <Label>카카오톡 아이디 :</Label>
                    <IdInput type="text" placeholder="" />
                </SocialBox>
                <SocialBox>
                    <IconCircle type="instagram"><FaInstagram /></IconCircle>
                    <Label>인스타 아이디 :</Label>
                    <IdInput type="text" placeholder="" />
                </SocialBox>
            </Row>
        </Section>
    );
}

export default IdSection;