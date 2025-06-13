import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import theme from '../../styles/theme';

const ProductGrid = ({ products }) => {
  return (
    <GridContainer>
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <NoProductsMessage>상품이 없습니다.</NoProductsMessage>
      )}
    </GridContainer>
  );
};

export default ProductGrid;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing['4']};
  width: 100%;
  justify-content: center;
`;

const NoProductsMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${theme.colors.gray['500']};
  font-size: ${theme.fontSizes.md};
  padding: ${theme.spacing['8']};
`;
