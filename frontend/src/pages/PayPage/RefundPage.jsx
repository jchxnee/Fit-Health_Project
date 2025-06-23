import React, { useState } from 'react';
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

const RefundPage = () => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 취소 규정 모달 상태

  // 취소 규정 모달 열기/닫기 핸들러
  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  return (
    <PaymentContainer>
      <TitleBar title={'환불'} />
      <PaymentContentBox>
        {/* 레슨 정보 */}
        <section>
          <SectionTitle>요가 레슨</SectionTitle>
          <InfoStackedRow>
            <InfoKey>김요가 트레이너</InfoKey>
            <InfoValue>2025.06.12 PM 6시 30분</InfoValue>
            <InfoValue>진행 회차 : 3회차</InfoValue>
          </InfoStackedRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </section>

        {/* 예약자 정보 */}
        <section>
          <SectionTitle>예약자 정보</SectionTitle>
          <InfoRow className="horizontal-start">
            <InfoKey>김현아</InfoKey>
            <InfoValue>010-5028-0682</InfoValue>
          </InfoRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </section>

        {/* 환불 정보 */}
        <PaymentAmountSection>
          <SectionTitle>환불 정보</SectionTitle>
          <InfoRow>
            <InfoKey>결제 금액</InfoKey>
            <InfoValue>237,500원</InfoValue>
          </InfoRow>
          <InfoRow>
            <CancleInfoKey>
              취소 수수료
              <CiCircleInfo style={{ cursor: 'pointer' }} onClick={handleOpenCancelModal} />
            </CancleInfoKey>
            <InfoValue>3,750원</InfoValue>
          </InfoRow>
          <TotalAmountRow>
            <TotalAmountKey>환불 금액</TotalAmountKey>
            <TotalAmountValue $isRed>233,750원</TotalAmountValue>
          </TotalAmountRow>
          <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
        </PaymentAmountSection>

        {/* 결제하기 버튼 */}
        <PaymentButton>환불 신청</PaymentButton>
      </PaymentContentBox>

      {/* 취소 규정 모달 */}
      {isCancelModalOpen && (
        <ModalOverlay onClick={handleCloseCancelModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {' '}
            {/* 모달 바깥 클릭 시 닫히도록 */}
            <ModalHeader>
              <ModalTitle>취소 규정</ModalTitle>
              <CloseButton onClick={handleCloseCancelModal}>&times;</CloseButton>
            </ModalHeader>
            <Table>
              <thead>
                <tr>
                  <th>기간</th>
                  <th>취소 수수료율</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>코칭 7일(168시간) 전 취소시</td>
                  <td>전액 환불</td>
                </tr>
                <tr>
                  <td>코칭 5일(168시간) 전 취소시</td>
                  <td>총 코칭비의 10%</td>
                </tr>
                <tr>
                  <td>코칭 3일(168시간) 전 취소시</td>
                  <td>총 코칭비의 50%</td>
                </tr>
                <tr>
                  <td>코칭 2일(48시간) 전 취소시</td>
                  <td>총 코칭비의 80%</td>
                </tr>
                <tr>
                  <td>코칭 하루전(24시간) 전 취소시</td>
                  <td>취소 및 환불 불가</td>
                </tr>
              </tbody>
            </Table>
            <PolicyList>
              <li>취소 규정은 예약일자 기준으로 적용됩니다.</li>
              <li>당일 예약건에 한해 예약시간 기준 1시간 이내 취소시 전액 환불됩니다.</li>
              <li>
                취소 수수료는 쿠폰 및 포인트와 같은 할인금액을 제외하지 않은 전체 예약 금액을 기준으로 계산됩니다.
              </li>
            </PolicyList>
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
