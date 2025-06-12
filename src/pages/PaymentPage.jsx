import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../styles/common/Button';
import { MdArrowForwardIos, MdKeyboardArrowRight } from 'react-icons/md';
import RecommendedExerciseSection from '../components/TitleBar';

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

  // Static content for terms (can be fetched from API in real app)
  // termDetails 객체를 제거했습니다.

  return (
    <PaymentContainer>
      <RecommendedExerciseSection title={'결제'} />
      <PaymentContentBox>
        {/* 요가 레슨 정보 - Vertical Alignment */}
        <section>
          <SectionTitle>요가 레슨</SectionTitle>
          <InfoStackedRow>
            {' '}
            {/* Use InfoStackedRow */}
            <InfoKey>김요가 트레이너</InfoKey>
            <InfoValue>2025.06.12 PM 6시 30분</InfoValue>
          </InfoStackedRow>
        </section>

        {/* 예약자 정보 - Vertical Alignment */}
        <section>
          <SectionTitle>예약자 정보</SectionTitle>
          <InfoStackedRow>
            {' '}
            {/* Use InfoStackedRow */}
            <InfoKey>김현아</InfoKey>
            <InfoValue>010-5028-0682</InfoValue>
          </InfoStackedRow>
        </section>

        {/* 결제 정보 - Horizontal Alignment (remains InfoRow) */}
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
        </PaymentAmountSection>

        {/* 전체 동의 및 약관 부분 */}
        <TermsAndConditionsGroup>
          {/* The entire AllAgreeCheckboxWrapper is clickable to toggle all. */}
          <AllAgreeCheckboxWrapper onClick={() => handleAllAgreeChange({ target: { checked: !allAgreed } })}>
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={handleAllAgreeChange} // Still include onChange for semantic correctness
            />
            <label>전체 동의</label>
          </AllAgreeCheckboxWrapper>

          <TermItem>
            <TermLabel>
              {/* CheckboxAndText now handles checkbox toggle */}
              <CheckboxAndText onClick={() => handleIndividualAgreeChange('rule')}>
                <TermCheckbox
                  type="checkbox"
                  checked={agreements.rule}
                  // onChange is here for direct checkbox click
                  onChange={() => handleIndividualAgreeChange('rule')}
                />
                <TermText>예약 이용규칙 및 취소/환불 동의 (필수)</TermText>
              </CheckboxAndText>
              {/* TermLink only toggles content */}
              <TermLink
                onClick={(e) => {
                  e.preventDefault(); // 기본 링크 동작 방지
                  e.stopPropagation(); // Prevent event bubbling up
                  handleToggleTermContent('rule');
                }}
              >
                (자세히 보기)
              </TermLink>
            </TermLabel>
            {/* 약관 내용을 <p> 태그로 직접 작성 */}
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
                <TermText>개인정보 수집 및 이용 동의 (필수)</TermText>
              </CheckboxAndText>
              <TermLink
                onClick={(e) => {
                  e.preventDefault(); // 기본 링크 동작 방지
                  e.stopPropagation();
                  handleToggleTermContent('privacyCollect');
                }}
              >
                (자세히 보기)
              </TermLink>
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
                <TermText>개인정보 제 3자 제공 동의 (필수)</TermText>
              </CheckboxAndText>
              <TermLink
                onClick={(e) => {
                  e.preventDefault(); // 기본 링크 동작 방지
                  e.stopPropagation();
                  handleToggleTermContent('privacyThirdParty');
                }}
              >
                (자세히 보기)
              </TermLink>
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
        <PaymentButton>237,500원 결제하기</PaymentButton>
      </PaymentContentBox>
    </PaymentContainer>
  );
};

export default PaymentPage;

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[10]} 0; // Top and bottom padding
  box-sizing: border-box;
`;

const PaymentContentBox = styled.div`
  width: 100%;
  max-width: 1008px; // Similar to login form max-width
  padding: ${({ theme }) => theme.spacing[8]}; // Internal padding
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]}; // Gap between major sections
`;

const SectionTitle = styled.h2`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes['2xl']}; // 24px
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]}; // 16px below title
`;

const InfoStackedRow = styled.div`
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: flex-start; /* Align items to the left */
  padding: ${({ theme }) => theme.spacing[2]} 0;

  &:last-of-type {
    padding-bottom: ${({ theme }) => theme.spacing[4]}; // 16px below title
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]}; /* Separator above terms */
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0; // Vertical padding for rows

  &:last-of-type {
    border-bottom: none; // No border for the last row in a group
  }
`;

const InfoKey = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* Small space below key in stacked rows */
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ $highlighted, theme }) => ($highlighted ? theme.fontWeights.bold : theme.fontWeights.regular)};
  color: ${({ $isRed, theme }) => ($isRed ? theme.colors.danger : theme.colors.primary)};
`;

const PaymentAmountSection = styled.div`
  /* No specific styling needed beyond general section styling */
`;

const TotalAmountRow = styled(InfoRow)`
  padding-top: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const TotalAmountKey = styled(InfoKey)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const TotalAmountValue = styled(InfoValue)`
  font-size: ${({ theme }) => theme.fontSizes.lg}; // Larger font for total
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.danger}; // Red for total amount
`;

// --- Terms and Conditions Styled Components ---
const TermsAndConditionsGroup = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing['3']};
  text-align: left;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[300]}; /* Separator above terms */
  padding-top: ${({ theme }) => theme.spacing['10']};
`;

const AllAgreeCheckboxWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']}; /* Added horizontal padding */
  border-radius: ${({ theme }) => theme.borderRadius.sm}; /* Small border radius */
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['5']}; /* Space below "전체 동의" */
  font-size: ${({ theme }) => theme.fontSizes.lg}; /* Larger font for all agree */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  input[type='checkbox'] {
    margin-right: ${({ theme }) => theme.spacing['2']};
    min-width: 20px; /* Slightly larger checkbox */
    min-height: 20px;
  }
`;

const TermItem = styled.div`
  padding: 0 ${({ theme }) => theme.spacing['3']}; /* Added horizontal padding */
  margin-bottom: 0;
`;

const TermLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between checkbox/label and link */
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckboxAndText = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1; /* Allow text to take available space */
  cursor: pointer; /* Only this part should trigger checkbox */
`;

const TermCheckbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing['2']};
  min-width: 16px;
  min-height: 16px;
  vertical-align: middle;
`;

const TermText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const TermLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.xs}; /* Smaller for '자세히 보기' */
  margin-left: ${({ theme }) => theme.spacing['2']};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TermsContent = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: ${(props) => (props.$isOpen ? '6px' : '0')}; /* Use theme spacing */
  margin-bottom: ${(props) => (props.$isOpen ? '12px' : '0')}; /* Use theme spacing */
  padding: ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.5;
  max-height: ${(props) => (props.$isOpen ? '200px' : '0')};
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

const PaymentButton = styled(ButtonStyle)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
`;
