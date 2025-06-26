import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import ButtonStyle from '../../styles/common/Button';
import { paymentService } from '../../api/payment';
import { toast } from 'react-toastify';

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

const ConfirmButton = styled(ButtonStyle)`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  margin-top: ${theme.spacing[8]};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
`;

const SalaryModal = ({ isOpen, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!data) return null;
  const { paymentId, userName, productPrice, productName, totalCount, hasSalary } = data;
  if (!isOpen) {
    return null;
  }

  const handleSalary = async () => {
    try {
      setIsLoading(true);
      const salaryFee = productPrice * 0.1;
      const salaryPrice = productPrice - salaryFee;
      const response = await paymentService.goSalary(paymentId, salaryPrice, salaryFee);
      console.log('정산 신청 처리 결과:', response);

      toast.success('정산 신청이 완료되었습니다!');
      onClose();
    } catch (error) {
      console.error('정산 신청 에러:', error);
      toast.error('정산 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>정산 정보</ModalTitle>
        <CustomerInfo>
          {userName} 고객님 {productName} 레슨 {totalCount}회권
        </CustomerInfo>

        <DetailRow>
          <DetailLabel>결제 금액</DetailLabel>
          <Amount>{productPrice.toLocaleString()}원</Amount>
        </DetailRow>
        <DetailRow>
          <DetailLabel>수수료(10%)</DetailLabel>
          <Amount>{(productPrice * 0.1).toLocaleString()}원</Amount>
        </DetailRow>
        <DetailRow>
          <DetailLabel>정산 금액</DetailLabel>
          <Amount $isRed>{(productPrice - productPrice * 0.1).toLocaleString()}원</Amount>
        </DetailRow>

        {!hasSalary && (
          <ConfirmButton onClick={handleSalary} disabled={isLoading}>
            신청하기
          </ConfirmButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SalaryModal;
