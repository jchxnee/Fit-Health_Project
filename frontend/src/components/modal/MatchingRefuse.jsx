import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { toast } from 'react-toastify';
import api from '../../api/axios'; // 사용자 정의 api 인스턴스 임포트
import { API_ENDPOINTS } from '../../api/config'; // API_ENDPOINTS 임포트

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
  padding: 40px 32px;
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 700px;
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  gap: ${theme.spacing[5]};

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

const RejectReasonLabel = styled.label`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.gray['900']};
  font-weight: ${theme.fontWeights.medium};
  text-align: left;
  margin-bottom: ${theme.spacing[3]};
`;

const ReasonTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.gray['300']};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.gray['100']};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.gray['900']};
  resize: none;
  line-height: 1.5;
  margin-bottom: ${theme.spacing[5]};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 1px ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.gray['500']};
  }
`;

const ConfirmQuestion = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.gray['900']};
  text-align: center;
  font-weight: ${theme.fontWeights.medium};
  margin-top: auto;
  margin-bottom: ${theme.spacing[5]};
`;

const RejectButton = styled.button`
  background-color: ${theme.colors.danger};
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
    background-color: ${theme.colors.dangerDark};
  }
`;

// reservationId prop을 추가합니다.
const MatchingRefuse = ({ isOpen, onClose, reservationNo, onRejectSuccess }) => {
  if (!isOpen) return null;

  const [rejectReason, setRejectReason] = useState('');

  const handleReject = async () => {
    if (rejectReason.trim() === '') {
      toast.error('거절 사유를 입력해주세요.');
      return;
    }

    try {
      await api.put(API_ENDPOINTS.PAYMENT.REJECT, {
        reservationNo: reservationNo,
        status: 'N',
        rejectReason: rejectReason,
      });

      toast.info('예약이 성공적으로 거절되었습니다.');
      onClose();
      if (onRejectSuccess) {
        onRejectSuccess(reservationNo); // 상위 컴포넌트에게 거절 완료 알림
      }
    } catch (error) {
      console.error('예약 거절 중 오류 발생:', error);
      toast.error('예약 거절 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <WarningSection>
          <WarningIcon>ⓘ</WarningIcon>
          <WarningTitle>고객 신청 거절 전 꼭 확인해주세요!</WarningTitle>
        </WarningSection>

        <ContentParagraph>
          고객의 신청을 거절하면 해당 예약은 취소되며, 고객은 다시 예약을 진행해야 합니다.
          <br />
          정당한 사유 없이 반복적으로 거절할 경우 불이익이 발생할 수 있습니다.
        </ContentParagraph>

        <RejectReasonLabel htmlFor="reject-reason">거절사유</RejectReasonLabel>
        <ReasonTextArea
          id="reject-reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="예: 갑작스러운 건강 악화로 병원 일정때문에 취소드립니다. 죄송합니다."
        />

        <ConfirmQuestion>요청을 거절하시겠습니까?</ConfirmQuestion>

        <RejectButton onClick={handleReject}>거절</RejectButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MatchingRefuse;
