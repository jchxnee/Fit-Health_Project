import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import ButtonStyle from '../../styles/common/Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  width: ${theme.width.sm};
  max-width: 90%;
  box-shadow: ${theme.shadows['2xl']};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  background: none;
  border: none;
  font-size: ${theme.fontSizes['xl']};
  color: ${theme.colors.gray[500]};
  cursor: pointer;
  padding: ${theme.spacing[1]};

  &:hover {
    color: ${theme.colors.gray[700]};
  }
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[6]};
`;

const CustomerInfo = styled.div`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[8]};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[700]};

  &:last-of-type {
    margin-bottom: ${theme.spacing[0]};
  }
`;

const DetailLabel = styled.span`
  color: ${theme.colors.gray[600]};
`;

const Amount = styled.span`
  font-weight: ${theme.fontWeights.medium};
  color: ${(props) => (props.$isRed ? theme.colors.danger : theme.colors.gray[900])};
`;

const RefundModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;
  const { trainerName, productPrice, productName, totalCount, refundPrice, refundFee } = data;
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>환불 정보</ModalTitle>
        <CustomerInfo>
          {trainerName} 코치 {productName} 레슨 {totalCount}회권
        </CustomerInfo>

        <DetailRow>
          <DetailLabel>결제 금액</DetailLabel>
          <Amount>{productPrice.toLocaleString()}원</Amount>
        </DetailRow>
        <DetailRow>
          <DetailLabel>환불 수수료</DetailLabel>
          <Amount>{refundFee.toLocaleString()}원</Amount>
        </DetailRow>
        <DetailRow>
          <DetailLabel>환불 금액</DetailLabel>
          <Amount $isRed>{refundPrice.toLocaleString()}원</Amount>
        </DetailRow>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RefundModal;
