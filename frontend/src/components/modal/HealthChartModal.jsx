import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HealthChart from '../HealthChart';
import { healthService } from '../../api/health';

const HealthChartModal = ({ isOpen, onClose, userEmail }) => {
  const [healthData, setHealthData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userEmail) return;

    const fetchData = async () => {
      setisLoading(true);
      try {
        const raw = await healthService.getHealthData(userEmail);
        setHealthData(raw); // 또는 transform 후 set
      } catch (err) {
        console.error('건강정보 가져오기 실패', err);
      } finally {
        setisLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userEmail]);

  if (!isOpen) return null;
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>건강 정보 차트</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ChartWrapper>
          <HealthChart rawData={healthData} isLoading={isLoading} />
        </ChartWrapper>
      </ModalBox>
    </Overlay>
  );
};

export default HealthChartModal;

// 모달 스타일
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
`;

const ChartWrapper = styled.div`
  height: 400px;
`;
