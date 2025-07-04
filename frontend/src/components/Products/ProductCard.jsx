import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const handleProductClick = () => {
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank');
    } else {
      toast.error('연결된 상품 페이지가 없습니다.');
    }
  };

  return (
    <Card onClick={handleProductClick}>
      <ImageWrapper>
        <ProductImage src={product.imageUrl} alt={product.name} />
      </ImageWrapper>
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        {product.originalPrice && product.discountRate && (
          <PriceWrapper>
            <OriginalPrice>{product.originalPrice}원</OriginalPrice>
            <DiscountRate>{product.discountRate}</DiscountRate>
          </PriceWrapper>
        )}
        <CurrentPrice>{product.price}원</CurrentPrice>
      </ProductInfo>
    </Card>
  );
};

export default ProductCard;

const Card = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray['200']};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.md};
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.gray['50']};
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: ${theme.spacing['2']};
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing['3']};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray['900']};
  margin-bottom: ${theme.spacing['2']};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  height: calc(1.4em * 2);
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: ${theme.spacing['1']};
  margin-top: ${theme.spacing['1']};
`;

const OriginalPrice = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray['500']};
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.danger};
`;

const CurrentPrice = styled.p`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing['1']};
  text-align: right;
`;
