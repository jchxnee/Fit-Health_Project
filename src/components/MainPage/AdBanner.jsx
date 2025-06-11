import React from 'react';
import styled from 'styled-components';

const BannerWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
`;
const Banner = styled.div`
  width: 1000px;
  height: 180px;
  background: #eee;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 40px 0;
`;
const Arrow = styled.button`
  width: 54px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 0.5px 0.5px 4px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;
const LeftArrow = styled(Arrow)`
  left: -28px;
`;
const RightArrow = styled(Arrow)`
  right: -28px;
`;

const AdBanner = () => (
    <BannerWrapper>
        <Banner>
            <LeftArrow>{'<'}</LeftArrow>
            <RightArrow>{'>'}</RightArrow>
        </Banner>
    </BannerWrapper>
);

export default AdBanner;