import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
import TitleBar from '../../components/TitleBar';
import useUserStore from '../../store/useUserStore';
import { paymentService } from '../../api/payment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null); // <- 결제 정보 상태 저장
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPaymentData = async () => {
      const data = await paymentService.getPaymentData(user.email);
      console.log('API 응답:', data);
      setPaymentData(data);
    };

    fetchPaymentData();
  }, [user.email]);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    let hours = date.getHours();
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${year}.${month}.${day} ${period} ${hours}시 ${minutes}분`;
  };

  const [agreements, setAgreements] = useState({
    rule: false,
    privacyCollect: false,
    privacyThirdParty: false,
  });

  const [termContentsOpen, setTermContentsOpen] = useState({
    rule: false,
    privacyCollect: false,
    privacyThirdParty: false,
  });

  // 계산형 상태로 전체 동의 여부 판단
  const allAgreed = Object.values(agreements).every(Boolean);

  // 전체 동의 체크박스 변경 시 개별 항목 전체 반영
  const handleAllAgreeChange = (e) => {
    const isChecked = e.target.checked;
    setAgreements({
      rule: isChecked,
      privacyCollect: isChecked,
      privacyThirdParty: isChecked,
    });
  };

  // 개별 약관 클릭 시 상태 업데이트 → allAgreed는 계산형이므로 자동 반영됨
  const handleIndividualAgreeChange = (termName) => {
    setAgreements((prev) => ({
      ...prev,
      [termName]: !prev[termName],
    }));
  };

  // Handle "자세히 보기" link click (only for opening/closing content)
  const handleToggleTermContent = (termName) => {
    setTermContentsOpen((prev) => ({
      ...prev,
      [termName]: !prev[termName],
    }));
  };

  const handlePayment = async () => {
    if (!agreements.rule || !agreements.privacyCollect || !agreements.privacyThirdParty) {
      toast.warning('모든 약관에 동의해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await paymentService.goPayment(paymentData.payment_id, paymentData.first_reservation);
      console.log('결제 처리 결과:', response);

      toast.success('결제가 완료되었습니다!');
      navigate('/matchingList');
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
    <>
      <PaymentContainer>
        <TitleBar title={'결제'} />
        <PaymentContentBox>
          {/* 레슨 정보 */}
          <section>
            <SectionTitle>{paymentData.product_name} 레슨</SectionTitle>
            <InfoStackedRow>
              <InfoKey>{paymentData.trainer_name} 트레이너</InfoKey>
              <InfoValue>{formatDateTime(paymentData.first_reservation)}</InfoValue>
            </InfoStackedRow>
            <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
          </section>

          {/* 예약자 정보 */}
          <section>
            <SectionTitle>예약자 정보</SectionTitle>
            <InfoRow className="horizontal-start">
              <InfoKey>{paymentData.user_name}</InfoKey>
              <InfoValue>{paymentData.user_phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</InfoValue>
            </InfoRow>
            <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
          </section>

          {/* 결제 정보 */}
          <PaymentAmountSection>
            <SectionTitle>결제 정보</SectionTitle>
            <InfoRow>
              <InfoKey>{paymentData.total_count}회 핏헬스 회원가</InfoKey>
              <InfoValue> {(paymentData.total_count * paymentData.once_price).toLocaleString()}원</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoKey>할인 금액</InfoKey>
              <InfoValue>
                {(() => {
                  const count = paymentData.total_count;
                  const basePrice = paymentData.total_count * paymentData.once_price;
                  let discount = 0;

                  if (count >= 3 && count < 5) {
                    discount = paymentData.discount_3;
                  } else if (count >= 5 && count < 10) {
                    discount = paymentData.discount_5;
                  } else if (count >= 10) {
                    discount = paymentData.discount_10;
                  }

                  const finalPrice = basePrice / discount;

                  return `${finalPrice.toLocaleString()}원`;
                })()}
              </InfoValue>
            </InfoRow>
            <TotalAmountRow>
              <TotalAmountKey>총 결제 금액</TotalAmountKey>
              <TotalAmountValue $isRed>{paymentData.product_price.toLocaleString()}원</TotalAmountValue>
            </TotalAmountRow>
            <InfoRow style={{ borderBottom: `1px solid #e5e7eb` }} />
          </PaymentAmountSection>

          {/* 전체 동의 및 약관 부분 */}
          <TermsAndConditionsGroup>
            <AllAgreeCheckboxWrapper onClick={() => handleAllAgreeChange({ target: { checked: !allAgreed } })}>
              <input type="checkbox" checked={allAgreed} onChange={handleAllAgreeChange} />
              <label>전체 동의</label>
            </AllAgreeCheckboxWrapper>

            <TermItem>
              <TermLabel>
                <CheckboxAndText>
                  <TermCheckbox
                    type="checkbox"
                    checked={agreements.rule}
                    onChange={() => handleIndividualAgreeChange('rule')}
                  />
                  <TermText onClick={() => handleIndividualAgreeChange('rule')}>
                    [필수] 예약 이용규칙 및 취소/환불 동의
                  </TermText>
                  <TermLink
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleTermContent('rule');
                    }}
                  >
                    (자세히 보기)
                  </TermLink>
                </CheckboxAndText>
              </TermLabel>
              <TermsContent $isOpen={termContentsOpen.rule}>
                <p>
                  본 약관은 요가 레슨 예약 및 취소, 환불에 대한 규정을 명시합니다. <br />
                  예약 변경 및 취소는 최소 24시간 전에 이루어져야 하며, 24시간 이내 취소 시 수수료가 발생할 수 있습니다.{' '}
                  <br />
                  환불 정책은 결제 방식 및 시점에 따라 상이할 수 있습니다.
                </p>
                <p>추가적인 약관 내용이 여기에 표시될 수 있습니다.</p>
              </TermsContent>
            </TermItem>

            <TermItem>
              <TermLabel>
                <CheckboxAndText>
                  <TermCheckbox
                    type="checkbox"
                    checked={agreements.privacyCollect}
                    onChange={() => handleIndividualAgreeChange('privacyCollect')}
                  />
                  <TermText onClick={() => handleIndividualAgreeChange('privacyCollect')}>
                    [필수] 개인정보 수집 및 이용 동의
                  </TermText>
                  <TermLink
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleTermContent('privacyCollect');
                    }}
                  >
                    (자세히 보기)
                  </TermLink>
                </CheckboxAndText>
              </TermLabel>
              {/* 개인정보 수집 및 이용 내용 */}
              <TermsContent $isOpen={termContentsOpen.privacyCollect}>
                <p>
                  개인정보 수집 및 이용 동의 내용은 다음과 같습니다: <br />
                  수집 항목 (이름, 연락처 등), <br />
                  수집 목적 (예약 확인, 서비스 제공 등), <br />
                  보유 및 이용 기간. <br />
                  상세 내용은 개인정보처리방침을 확인해주세요.
                </p>
                <p>개인정보 수집 및 이용 관련 추가 정보입니다.</p>
              </TermsContent>
            </TermItem>

            <TermItem>
              <TermLabel>
                <CheckboxAndText>
                  <TermCheckbox
                    type="checkbox"
                    checked={agreements.privacyThirdParty}
                    onChange={() => handleIndividualAgreeChange('privacyThirdParty')}
                  />
                  <TermText onClick={() => handleIndividualAgreeChange('privacyThirdParty')}>
                    [필수] 개인정보 제 3자 제공 동의
                  </TermText>
                  <TermLink
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleTermContent('privacyThirdParty');
                    }}
                  >
                    (자세히 보기)
                  </TermLink>
                </CheckboxAndText>
              </TermLabel>
              {/* 개인정보 제 3자 제공 내용 */}
              <TermsContent $isOpen={termContentsOpen.privacyThirdParty}>
                <p>
                  개인정보 제3자 제공 동의 내용은 다음과 같습니다: <br />
                  제공받는 자 (결제 대행사, 트레이너 등), <br />
                  제공 항목, <br />
                  제공 목적. <br />
                  서비스 제공을 위해 필요한 최소한의 정보만 제공됩니다.
                </p>
                <p>제3자 제공에 대한 상세 동의 내역입니다.</p>
              </TermsContent>
            </TermItem>
          </TermsAndConditionsGroup>

          {/* 결제하기 버튼 */}
          <PaymentButton onClick={handlePayment} disabled={isLoading}>
            {paymentData.product_price.toLocaleString()}원 결제하기
          </PaymentButton>
        </PaymentContentBox>
      </PaymentContainer>
    </>
  );
};

export default PaymentPage;

const TermsAndConditionsGroup = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  padding-top: ${({ theme }) => theme.spacing[10]};
`;

const AllAgreeCheckboxWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['5']};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  input[type='checkbox'] {
    margin-right: ${({ theme }) => theme.spacing['2']};
    min-width: 20px;
    min-height: 20px;
  }
`;

const TermItem = styled.div`
  padding: 0 ${({ theme }) => theme.spacing['3']};
  margin-bottom: 0;
`;

const TermLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const CheckboxAndText = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
`;

const TermCheckbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing['2']};
  min-width: 16px;
  min-height: 16px;
  vertical-align: middle;
`;

const TermText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing['1']};
`;

const TermLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TermsContent = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${(props) => (props.$isOpen ? '12px' : '0')};
  padding: 0 ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.5;
  max-height: ${(props) => (props.$isOpen ? '150px' : '0')};
  overflow-y: auto;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.$isOpen ? 0 : '-10px')});
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    max-height 0.3s ease,
    visibility 0.3s ease;
`;
