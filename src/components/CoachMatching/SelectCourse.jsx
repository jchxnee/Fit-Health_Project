import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const CourseSelectionBoxContainer = styled.div`
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  background-color: ${theme.colors.white};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing[10]};
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.black};
  font-weight: ${theme.fontWeights.bold};
`;

const DiscountInfo = styled.span`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.regular};
`;

const CoursePriceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[5]};
  flex-wrap: wrap;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${theme.colors.gray[400]};
  border-radius: ${theme.borderRadius.lg};
  overflow: visible;
  height: ${theme.spacing[10]};
  position: relative;
`;

const QuantityButton = styled.button`
  background: ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.gray[200] : theme.colors.gray[100])};
  border: none;
  width: 40px;
  height: 100%;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.gray[500] : theme.colors.gray[800])};
  transition: background-color 0.2s ease-in-out;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  outline: none;
  &:hover {
    background-color: ${({ $isDisabled, theme }) => ($isDisabled ? theme.colors.gray[200] : theme.colors.gray[300])};
  }

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.colors.gray[400]};
  }

  &:last-child {
    border-left: 1px solid ${({ theme }) => theme.colors.gray[400]};
  }
`;

const QuantityDisplay = styled.span`
  padding: 0 ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
`;

const PriceDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing[1]};
`;

const OriginalPrice = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[500]};
  text-decoration: line-through;
`;

const DiscountedPrice = styled.span`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.danger};
`;

const PromotionText = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.red};
  margin-top: ${theme.spacing[1]};
`;

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  right: -20px;
  background-color: ${({ theme }) => theme.colors.gray['800']};
  color: ${({ theme }) => theme.colors.white};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  white-space: nowrap;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  z-index: ${({ theme }) => theme.zIndices.tooltip};
`;

const SelectCourse = ({ courseQuantity, onQuantityChange, oneTimePrice }) => {
  const [showLimitMessage, setShowLimitMessage] = React.useState(false);

  const calculateDiscountedPrice = (quantity, pricePerSession) => {
    let discountRate = 0;
    if (quantity >= 10) {
      discountRate = 0.1;
    } else if (quantity >= 5) {
      discountRate = 0.05;
    } else if (quantity >= 3) {
      discountRate = 0.03;
    }

    const totalOriginalPrice = quantity * pricePerSession;
    const discountedAmount = totalOriginalPrice * discountRate;
    return totalOriginalPrice - discountedAmount;
  };

  const totalOriginalPrice = courseQuantity * oneTimePrice;
  const finalDiscountedPrice = calculateDiscountedPrice(courseQuantity, oneTimePrice);
  const isDiscountApplied = finalDiscountedPrice !== totalOriginalPrice;

  const handleInternalQuantityChange = (delta) => {
    const newQuantity = courseQuantity + delta;
    const MAX_QUANTITY = 30;

    if (delta > 0 && courseQuantity >= MAX_QUANTITY) {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 2000);
      return;
    }

    if (newQuantity < 1) return;

    setShowLimitMessage(false);
    onQuantityChange(delta);
  };

  return (
    <CourseSelectionBoxContainer>
      <CourseHeader>
        <span>{courseQuantity}회</span>
        {isDiscountApplied && <DiscountInfo>고객님께서 고르신 {courseQuantity}회 할인된 금액입니다.</DiscountInfo>}
      </CourseHeader>
      <CoursePriceWrapper>
        <QuantityControl>
          <QuantityButton onClick={() => handleInternalQuantityChange(-1)} $isDisabled={courseQuantity === 1}>
            -
          </QuantityButton>
          <QuantityDisplay>{courseQuantity}</QuantityDisplay>
          <QuantityButton onClick={() => handleInternalQuantityChange(1)} $isDisabled={courseQuantity >= 30}>
            +
          </QuantityButton>
          <Tooltip $isVisible={showLimitMessage}>30회까지만 이용가능합니다.</Tooltip>
        </QuantityControl>
        <PriceDetails>
          {isDiscountApplied && <OriginalPrice>{totalOriginalPrice.toLocaleString()}원</OriginalPrice>}
          <DiscountedPrice>{finalDiscountedPrice.toLocaleString()}원</DiscountedPrice>
          {isDiscountApplied && <PromotionText>{courseQuantity}회 이상 프로모션 적용</PromotionText>}
        </PriceDetails>
      </CoursePriceWrapper>
    </CourseSelectionBoxContainer>
  );
};

export default SelectCourse;
