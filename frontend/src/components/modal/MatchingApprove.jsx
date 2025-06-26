import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  position: relative;

  padding: 40px 32px;
  max-width: 700px;
  min-height: 480px;
  justify-content: space-between;

  @media (max-width: ${theme.width.sm}) {
    padding: ${theme.spacing[5]};
    width: ${theme.width.xs};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.gray['600']};
  padding: 0;

  &:hover {
    color: ${theme.colors.gray['900']};
  }
`;

const WarningSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const WarningIcon = styled.span`
  color: ${theme.colors.gray['500']};
  font-size: ${theme.fontSizes.xl};
  line-height: 1;
  font-weight: bold;
`;

const WarningTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.gray['900']};
  margin: 0;
  font-weight: ${theme.fontWeights.medium};
`;

const ContentParagraph = styled.p`
  text-align: left;
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.gray['700']};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[5]};
`;

const StyledList = styled.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  margin-left: 16px;
  margin-bottom: ${theme.spacing[8]};
`;

const ListItem = styled.li`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray['700']};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[3]};
  position: relative;
  padding-left: 12px;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${theme.colors.gray['500']};
    font-size: ${theme.fontSizes.md};
    line-height: 1.6;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ConfirmQuestion = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.gray['900']};
  text-align: left;
  font-weight: ${theme.fontWeights.medium};
  margin-top: auto;
  margin-bottom: ${theme.spacing[5]};
`;

const ApproveButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: 16px 24px;
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

// reservationId prop을 추가합니다.
const MatchingApprove = ({ isOpen, onClose, reservationNo, onApproveSuccess }) => {
  if (!isOpen) return null;

  const handleApprove = async () => {
    try {
      console.log('handleApprove: Sending reservationNo:', reservationNo);
      await api.put(API_ENDPOINTS.PAYMENT.APPROVED, {
        reservationNo: reservationNo,
        status: 'Y',
      });

      toast.success('예약이 성공적으로 승인되었습니다.');
      onClose();
      if (onApproveSuccess) {
        onApproveSuccess(reservationNo); // 상위 컴포넌트에게 승인 완료 알림
      }
    } catch (error) {
      console.error('예약 승인 중 오류 발생:', error);
      toast.error('예약 승인 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <WarningSection>
          <WarningIcon>ⓘ</WarningIcon>
          <WarningTitle>고객 신청 승인 전 꼭 확인해주세요!</WarningTitle>
        </WarningSection>

        <ContentParagraph>
          고객의 신청을 승인하면, 해당 고객은 첫 예약 날짜에 맞게 트레이닝을 진행하게 됩니다.
          <br />
          승인 이후에는 트레이너로서 다음 사항에 대해 책임이 발생합니다.
        </ContentParagraph>

        <StyledList>
          <ListItem>
            승인 후 트레이닝을 고의로 미루거나, 연락을 끊고 이행하지 않는 '먹튀' 행위 적발 시,
            <br />
            고객 보호를 위해 결제 금액의 최대 5배까지 배상 청구 및 형사 고발 조치가 진행될 수 있습니다.
          </ListItem>
          <ListItem>
            승인 후에는 고객이 비용을 환불하지 못하므로, 단순한 호기심이나 테스트로 승인하지 마세요.
            <br />
            승인 자체가 정식 계약 의사로 간주되며, 이에 따른 책임이 발생합니다.
          </ListItem>
        </StyledList>

        <ConfirmQuestion>핏코칭 요청을 승인하시겠습니까?</ConfirmQuestion>

        <ApproveButton onClick={handleApprove}>승인</ApproveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MatchingApprove;
