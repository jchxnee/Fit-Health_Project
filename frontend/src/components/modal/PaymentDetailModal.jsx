import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import StatusBadge from '../StatusBadge';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

const fetchPaymentDetail = async (paymentId) => {
  try {
    const response = await api.get(API_ENDPOINTS.PAYMENT.DETAIL(paymentId));
    return response.data;
  } catch (error) {
    console.error(`결제 ID ${paymentId} 상세 정보 가져오기 실패:`, error);
    const errorMessage = error.response?.data?.message || '결제 상세 정보를 불러오는 데 실패했습니다.';
    throw new Error(errorMessage);
  }
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing['6']};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  min-width: 400px;
  max-width: 600px;
  // ⭐ 삭제 ⭐ max-height: 80vh;
  // ⭐ 삭제 ⭐ overflow-y: auto;
  position: relative;

  h2 {
    color: ${theme.colors.primary};
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing['4']};
    text-align: center;
  }

  button {
    display: block;
    width: 100%;
    padding: ${theme.spacing['3']};
    margin-top: ${theme.spacing['5']};
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    font-size: ${theme.fontSizes.md};
    font-weight: ${theme.fontWeights.semibold};
    &:hover {
      background-color: ${theme.colors.primaryDark};
    }
  }
`;

const DetailItem = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed ${theme.colors.gray['200']};
  padding: ${theme.spacing['2']} 0;
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.gray['800']};

  &:last-of-type {
    border-bottom: none;
  }

  span:first-child {
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.gray['700']};
  }
  span:last-child {
    font-weight: ${theme.fontWeights.semibold};
    color: ${theme.colors.gray['900']};
  }
`;

const PaymentDetailModal = ({ isOpen, onClose, data: initialData }) => {
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialData && initialData.paymentId) {
      const getDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const detail = await fetchPaymentDetail(initialData.paymentId);
          setPaymentDetail(detail);
        } catch (err) {
          setError(err.message || '결제 상세 정보를 불러오는 데 실패했습니다.');
          setPaymentDetail(null);
        } finally {
          setLoading(false);
        }
      };
      getDetail();
    } else if (!isOpen) {
      setPaymentDetail(null);
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (e) {
      console.error('날짜 파싱 오류:', e);
      return 'N/A';
    }
  };

  // ⭐ 추가된 로직: 이용권 상태를 동적으로 결정 ⭐
  const getDynamicUseStatus = () => {
    if (!paymentDetail) return 'N/A';

    const totalCount = paymentDetail.total_count;
    const usedCount = paymentDetail.used_count;

    // 총 회차와 사용 회차를 숫자로 변환 (undefined, null, 문자열 등에 대비)
    const parsedTotal = parseInt(totalCount, 10);
    const parsedUsed = parseInt(usedCount, 10);

    // 숫자로 변환 가능하고 유효한 값인 경우에만 비교
    if (!isNaN(parsedTotal) && !isNaN(parsedUsed)) {
      if (parsedUsed >= parsedTotal && parsedTotal > 0) {
        // 총 회차가 0보다 크고 사용 회차가 총 회차 이상일 경우
        return '사용 완료';
      }
    }
    // 기본적으로 백엔드에서 내려온 use_status 값을 사용
    // 만약 백엔드에서 'Y'와 같은 값을 내려준다면, 이 값을 '사용 중' 등으로 매핑
    // StatusBadge.jsx에서 'Y'를 '정상'으로 처리하고 있으므로, 그에 맞춰 '사용 중'이라고 표시 가능
    return paymentDetail.use_status === 'Y' ? '사용 중' : paymentDetail.use_status || 'N/A';
  };

  const dynamicUseStatus = getDynamicUseStatus();

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>결제 상세 내역</h2>
        {loading && <p>데이터를 불러오는 중...</p>}
        {error && <p style={{ color: theme.colors.danger }}>{error}</p>}
        {/* paymentDetail이 null이 아닐 때만 렌더링 */}
        {!loading && !error && paymentDetail ? (
          <>
            <DetailItem>
              <span>주문 ID:</span> <span>{paymentDetail.payment_id}</span>
            </DetailItem>
            <DetailItem>
              <span>상품명:</span> <span>{paymentDetail.product_name || 'N/A'}</span>
            </DetailItem>
            <DetailItem>
              <span>결제 금액:</span>{' '}
              <span>
                {paymentDetail.product_price ? `${paymentDetail.product_price.toLocaleString()}원` : 'N/A'}
              </span>{' '}
            </DetailItem>
            <DetailItem>
              <span>결제자:</span> <span>{paymentDetail.user_name || paymentDetail.user_email || 'N/A'}</span>{' '}
            </DetailItem>
            <DetailItem>
              <span>트레이너:</span>{' '}
              <span>{paymentDetail.trainer_name || paymentDetail.trainer_email || 'N/A'}</span>{' '}
            </DetailItem>
            <DetailItem>
              <span>총 회차:</span> <span>{paymentDetail.total_count || 'N/A'}</span>
            </DetailItem>
            <DetailItem>
              <span>사용 회차:</span> <span>{paymentDetail.used_count || '0'}</span>
            </DetailItem>
            <DetailItem>
              <span>남은 회차:</span>{' '}
              <span>
                {paymentDetail.total_count !== undefined && paymentDetail.used_count !== undefined
                  ? paymentDetail.total_count - paymentDetail.used_count
                  : 'N/A'}
              </span>{' '}
            </DetailItem>
            <DetailItem>
              <span>결제 상태:</span> <StatusBadge status={paymentDetail.payment_status} />
            </DetailItem>
            <DetailItem>
              <span>이용권 상태:</span> <StatusBadge status={dynamicUseStatus} />
            </DetailItem>
            <DetailItem>
              <span>결제 방식:</span> <span>{paymentDetail.payment_method || 'N/A'}</span>
            </DetailItem>
            <DetailItem>
              <span>거래 ID:</span> <span>{paymentDetail.transaction_id || 'N/A'}</span>
            </DetailItem>
            <DetailItem>
              <span>결제일:</span> <span>{formatDate(paymentDetail.payment_at || paymentDetail.applied_at)}</span>{' '}
            </DetailItem>
            <DetailItem>
              <span>최초 예약일:</span> <span>{formatDate(paymentDetail.first_reservation)}</span>
            </DetailItem>
            <DetailItem>
              <span>리뷰 작성 여부:</span> <span>{paymentDetail.has_review ? 'O' : 'X'}</span>{' '}
            </DetailItem>
            <DetailItem>
              <span>환불 여부:</span> <span>{paymentDetail.has_refund ? 'O' : 'X'}</span>
            </DetailItem>
            <button onClick={onClose}>닫기</button>
          </>
        ) : (
          !loading && !error && <p>결제 상세 정보를 불러올 수 없습니다.</p>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentDetailModal;
