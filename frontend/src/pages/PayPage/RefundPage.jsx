import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  InfoKey,
  InfoRow,
  InfoStackedRow,
  InfoValue,
  PaymentAmountSection,
  PaymentContainer,
  PaymentContentBox,
  SectionTitle,
  TotalAmountKey,
  TotalAmountRow,
  TotalAmountValue,
  PaymentButton,
} from '../../styles/common/Payment';
import { CiCircleInfo } from 'react-icons/ci';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';
import useUserStore from '../../store/useUserStore';
import { paymentService } from '../../api/payment';
import { toast } from 'react-toastify';

const RefundPage = () => {
  const { user } = useUserStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null); // <- 결제 정보 상태 저장
  const [reservationData, setReservationData] = useState(null); // <- 예약 횟수 저장
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.email || !id) return;
    console.log('paymentId:', id);

    const fetchPaymentData = async () => {
      const payments = await paymentService.getPaymentData(id);
      const reservations = await paymentService.getReservationData(id);
      setPaymentData(payments);
      setReservationData(reservations);
    };

    fetchPaymentData();
  }, [user.email, id]);

  const getValidReservationCount = (reservations) => {
    const now = new Date();
    const limitTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24시간 전

    return reservations.filter((reservation) => {
      const date = new Date(reservation.selectDate);
      return date >= limitTime; // 24시간 이내만 포함
    }).length;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getRefundAmount = (paymentData, reservationData) => {
    if (!paymentData || !reservationData) return { refund: 0, used: 0, fee: 0 };

    const unitPrice = paymentData.product_price;
    const usedCount = getValidReservationCount(reservationData);
    const usedAmount = unitPrice * usedCount;
    const cancelFee = (unitPrice - usedAmount) * 0.1;
    const refundAmount = paymentData.product_price - usedAmount - cancelFee;

    return {
      used: Math.floor(usedAmount),
      fee: Math.floor(cancelFee),
      refund: Math.floor(refundAmount),
    };
  };

  const { used, fee, refund } = getRefundAmount(paymentData, reservationData);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleRefund = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.goRefund(id, refund, fee);
      console.log('결제 처리 결과:', response);

      toast.success('환불 처리가 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('결제 에러:', error);
      toast.error('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentData) {
    return <div>결제 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <PaymentContainer>
      <TitleBar title={'환불'} />
      <PaymentContentBox>
        <section>
          <SectionTitle>{paymentData.product_name} 레슨</SectionTitle>
          <InfoStackedRow>
            <InfoKey>{paymentData.trainer_name} 트레이너</InfoKey>
          </InfoStackedRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </section>

        <section>
          <SectionTitle>예약자 정보</SectionTitle>
          <InfoRow className="horizontal-start">
            <InfoKey>{paymentData.user_name}</InfoKey>
            <InfoValue>{paymentData.user_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</InfoValue>
          </InfoRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </section>

        <section>
          <SectionTitle>회차 정보</SectionTitle>
          <InfoStackedRow className="horizontal-start">
            {reservationData.map((reservation, index) => (
              <InfoKey key={index}>
                {index + 1}회차 예약 날짜 : {formatDate(reservation.selectDate)}
              </InfoKey>
            ))}
            <br />
            <InfoKey>진행된 회차 : {getValidReservationCount(reservationData)}회</InfoKey>
            <InfoKey>전체 회차 : {paymentData.total_count}회</InfoKey>
          </InfoStackedRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </section>

        <PaymentAmountSection>
          <SectionTitle>환불 정보</SectionTitle>
          <InfoRow>
            <InfoKey>결제 금액</InfoKey>
            <InfoValue>{paymentData.product_price.toLocaleString()}원</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoKey>사용된 금액</InfoKey>
            <InfoValue>{used.toLocaleString()}원</InfoValue>
          </InfoRow>
          <InfoRow>
            <CancleInfoKey>
              취소 수수료
              <CiCircleInfo style={{ cursor: 'pointer' }} onClick={handleOpenCancelModal} />
            </CancleInfoKey>
            <InfoValue>{fee.toLocaleString()}원</InfoValue>
          </InfoRow>
          <TotalAmountRow>
            <TotalAmountKey>환불 예정 금액</TotalAmountKey>
            <TotalAmountValue $isRed>{refund.toLocaleString()}원</TotalAmountValue>
          </TotalAmountRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </PaymentAmountSection>

        <PaymentButton onClick={handleRefund} disabled={isLoading}>
          환불 신청
        </PaymentButton>
      </PaymentContentBox>

      {isCancelModalOpen && (
        <ModalOverlay onClick={handleCloseCancelModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>취소 수수료 안내</ModalTitle>
              <CloseButton onClick={handleCloseCancelModal}>&times;</CloseButton>
            </ModalHeader>

            <p>
              할인 패키지(3회, 5회, 10회 등)를 결제한 경우, 패키지별 최소 이행 회차 기준을 충족한 뒤 남은 회차에 대해
              아래와 같이 환불 및 취소 수수료가 적용됩니다.
            </p>

            <br />

            <strong>📌 취소 수수료 기준</strong>
            <ul>
              <li>
                환불 가능한 회차에 대해 <strong>총 결제 금액 ÷ 전체 예약 회차 × 미사용 회차</strong>로 환불 금액을
                계산합니다.
              </li>
              <li>
                이 환불 금액의 <strong>10%</strong>는 취소 수수료로 공제되며, 나머지가 환불됩니다.
              </li>
              <li>
                <strong>예시:</strong> 10회 중 7회만 진행하고 환불 요청 시, <br />
                → 총 결제 금액 ÷ 10 × 3 = 미사용 금액
                <br />→ 이 금액의 10% 공제 후 환불
              </li>
            </ul>
          </ModalContent>
        </ModalOverlay>
      )}
    </PaymentContainer>
  );
};

export default RefundPage;

export const CancleInfoKey = styled(InfoKey)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  flex-grow: 1;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    padding: ${({ theme }) => theme.spacing[3]};
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.primary};
  }

  th {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const PolicyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.gray[700]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    line-height: 1.4;
    &::before {
      content: '•';
      color: ${({ theme }) => theme.colors.primary};
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
`;
