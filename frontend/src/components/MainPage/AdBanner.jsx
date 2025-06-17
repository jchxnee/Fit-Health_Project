import React from 'react';
import styled from 'styled-components';

const BannerWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
`;
const Banner = styled.div`
  width: ${({ theme }) => theme.width.lg};
  height: 180px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: ${({ theme }) => `${theme.spacing[10]} 0`};
`;
const Arrow = styled.button`
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
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