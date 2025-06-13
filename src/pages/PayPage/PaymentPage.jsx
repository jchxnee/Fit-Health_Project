import React, { useState } from 'react';
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

const PaymentPage = () => {
  const [agreements, setAgreements] = useState({
    rule: false, // 예약 이용규칙 및 취소/환불 동의
    privacyCollect: false, // 개인정보 수집 및 이용 동의
    privacyThirdParty: false, // 개인정보 제 3자 제공 동의
  });

  const [termContentsOpen, setTermContentsOpen] = useState({
    rule: false,
    privacyCollect: false,
    privacyThirdParty: false,
  });

  // Calculate if "전체 동의" should be checked
  const allAgreed = Object.values(agreements).every(Boolean);

  // Handle "전체 동의" checkbox click
  const handleAllAgreeChange = (e) => {
    const isChecked = e.target.checked;
    setAgreements({
      rule: isChecked,
      privacyCollect: isChecked,
      privacyThirdParty: isChecked,
    });
  };

  // Handle individual checkbox click (only when checkbox or text is clicked)
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

  return (
    <PaymentContainer>
      <TitleBar title={'결제'} />
      <PaymentContentBox>
        {/* 레슨 정보 */}
        <section>
          <SectionTitle>요가 레슨</SectionTitle>
          <InfoStackedRow>
            <InfoKey>김요가 트레이너</InfoKey>
            <InfoValue>2025.06.12 PM 6시 30분</InfoValue>
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

        {/* 결제 정보 */}
        <PaymentAmountSection>
          <SectionTitle>결제 정보</SectionTitle>
          <InfoRow>
            <InfoKey>5회 핏헬스 회원가</InfoKey>
            <InfoValue>250,000원</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoKey>할인 금액</InfoKey>
            <InfoValue>1,250원</InfoValue>
          </InfoRow>
          <TotalAmountRow>
            <TotalAmountKey>총 결제 금액</TotalAmountKey>
            <TotalAmountValue $isRed>237,500원</TotalAmountValue>
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
              <CheckboxAndText onClick={() => handleIndividualAgreeChange('rule')}>
                <TermCheckbox
                  type="checkbox"
                  checked={agreements.rule}
                  onChange={() => handleIndividualAgreeChange('rule')}
                />
                <TermText>[필수] 예약 이용규칙 및 취소/환불 동의</TermText>
                <TermLink
                  onClick={(e) => {
                    e.preventDefault(); // 기본 링크 동작 방지
                    e.stopPropagation(); // 이벤트 버블링 방지
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
              <CheckboxAndText onClick={() => handleIndividualAgreeChange('privacyCollect')}>
                <TermCheckbox
                  type="checkbox"
                  checked={agreements.privacyCollect}
                  onChange={() => handleIndividualAgreeChange('privacyCollect')}
                />
                <TermText>[필수] 개인정보 수집 및 이용 동의</TermText>
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
              <CheckboxAndText onClick={() => handleIndividualAgreeChange('privacyThirdParty')}>
                <TermCheckbox
                  type="checkbox"
                  checked={agreements.privacyThirdParty}
                  onChange={() => handleIndividualAgreeChange('privacyThirdParty')}
                />
                <TermText>[필수] 개인정보 제 3자 제공 동의</TermText>
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
        <PaymentButton to="/matchingList">237,500원 결제하기</PaymentButton>
      </PaymentContentBox>
    </PaymentContainer>
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
