import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styled from 'styled-components';
import ProductCategory from '../../components/Products/ProductCategory';
import TitleBar from '../../components/TitleBar';
import theme from '../../styles/theme';
import ProductGrid from '../../components/Products/ProductGrid';

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 100px);
`;

const ContentWrapper = styled.div`
  width: ${theme.width.lg};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TitleBarContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const ProductsSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 40px;
`;

const ProductCategoryContainer = styled.div`
  flex-shrink: 0;
  width: 220px;
`;

const ProductGridContainer = styled.div`
  flex-grow: 1;
`;

const ProductList = () => {
  const Productimg = {
    product1:
      'https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/1025_amir_coupang_oct_80k/9741/0c90a44baf8853a526d20441d02c4d163740d7e22fad6cf88acc331293de.jpg',
    product2:
      'https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/1025_amir_coupang_oct_80k/5a73/41aff8c9d704b5b691795c5da4f03f0720d56fad497cf51673691296f029.jpg',
    product3:
      'https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/vendor_inventory/f5d7/44c1cbd5e9f95bd85157648dd7a2cb8f082f59156d4c01bb760eeedcffb2.jpg',
    product4:
      'https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/vendor_inventory/23ca/c8a89ce31b158457f0c8785ba5cf28db36e9afac3d982ea7605210d0e3d7.jpg',
    product5:
      'https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/retail/images/952780200649278-04117b58-edaf-415e-883f-f21e584a5ce6.jpg',
    product6:
      'https://thumbnail8.coupangcdn.com/thumbnails/remote/320x320ex/image/vendor_inventory/ee6b/70f40e72d6c79b643be3d2da043a4f98231c9c5a8134ecd057df5bf7d214.jpg',
  };

  const Productlink = {
    product1:
      'https://www.coupang.com/vp/products/7311465993?itemId=2565929726&vendorItemId=70558385780&q=%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84+%EB%A9%80%ED%8B%B0%EB%B9%84%ED%83%80%EB%AF%BC&searchId=ca4944ea178598&sourceType=search&itemsCount=36&searchRank=1&rank=1',
    product2:
      'https://www.coupang.com/vp/products/191623471?itemId=547880016&vendorItemId=4437264551&sourceType=srp_product_ads&clickEventId=4dc7e3a0-4804-11f0-883d-bd2db917f287&korePlacement=15&koreSubPlacement=6&clickEventId=4dc7e3a0-4804-11f0-883d-bd2db917f287&korePlacement=15&koreSubPlacement=6',
    product3:
      'https://www.coupang.com/vp/products/6854281548?itemId=24019532759&vendorItemId=4765824657&pickType=COU_PICK&sourceType=srp_product_ads&clickEventId=c9ab16a0-4803-11f0-9671-7b4731f2aacc&korePlacement=15&koreSubPlacement=1&clickEventId=c9ab16a0-4803-11f0-9671-7b4731f2aacc&korePlacement=15&koreSubPlacement=1',
    product4:
      'https://www.coupang.com/vp/products/7522703123?itemId=17496413220&vendorItemId=86837595555&sourceType=srp_product_ads&clickEventId=d6579090-4803-11f0-8fe9-d3df5044c2c3&korePlacement=15&koreSubPlacement=1&clickEventId=d6579090-4803-11f0-8fe9-d3df5044c2c3&korePlacement=15&koreSubPlacement=1',
    product5:
      'https://www.coupang.com/vp/products/6204369926?itemId=12329742710&vendorItemId=79599736984&q=%EB%B9%84%EA%B1%B4+%ED%94%84%EB%A1%9C%ED%8B%B4+%EB%B0%94&searchId=5fefae2a191355&sourceType=search&itemsCount=36&searchRank=3&rank=3',
    product6:
      'https://www.coupang.com/vp/products/275970916?itemId=130994412&vendorItemId=3275273068&sourceType=srp_product_ads&clickEventId=dfff87a0-4804-11f0-a344-4c9d943214dd&korePlacement=15&koreSubPlacement=1&clickEventId=dfff87a0-4804-11f0-a344-4c9d943214dd&korePlacement=15&koreSubPlacement=1',
  };

  const userInfo = {
    name: '이주찬',
    image: '../../../public/img/minju.png',
  };

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchedProducts = [
      {
        id: 'p1',
        name: '프리미엄 멀티비타민',
        imageUrl: Productimg.product1,
        price: '29,900',
        externalUrl: Productlink.product1,
        category: 'health-supplements',
        originalPrice: '49,500',
        discountRate: '39%',
      },
      {
        id: 'p2',
        name: '고단백 식사대용 쉐이크',
        imageUrl: Productimg.product2,
        price: '19,490',
        externalUrl: Productlink.product2,
        category: 'diet-food',
        originalPrice: '31,400',
        discountRate: '37%',
      },
      {
        id: 'p3',
        name: '오메가3 피쉬오일',
        imageUrl: Productimg.product3,
        price: '48,430',
        externalUrl: Productlink.product3,
        category: 'health-supplements',
        originalPrice: '67,270',
        discountRate: '28%',
      },
      {
        id: 'p4',
        name: '유산균 캡슐 100억 CFU',
        imageUrl: Productimg.product4,
        price: '25,270',
        externalUrl: Productlink.product4,
        category: 'health-supplements',
        originalPrice: '35,300',
        discountRate: '28%',
      },
      {
        id: 'p5',
        name: '비건 프로틴 바',
        imageUrl: Productimg.product5,
        price: '22,400',
        externalUrl: Productlink.product5,
        category: 'meal-replacement',
        originalPrice: '23,000',
        discountRate: '2%',
      },
      {
        id: 'p6',
        name: '아리프 NBR 요가매트',
        imageUrl: Productimg.product6,
        price: '9,900',
        externalUrl: Productlink.product6,
        category: 'home-training',
        originalPrice: '16,000',
        discountRate: '38%',
      },
    ];
    setProducts(fetchedProducts);
  }, []);

  const handleCategorySelect = (categoryKey) => {
    if (selectedCategory === categoryKey && categoryKey === 'all') {
      setProducts((prev) => [...prev]);
    } else {
      setSelectedCategory(categoryKey);
    }
    console.log(`선택된 카테고리: ${categoryKey}`);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  return (
    <>
      <Header user={userInfo} />
      <PageWrapper>
        <ContentWrapper>
          <TitleBarContainer>
            <TitleBar title={'건강상품'} />
          </TitleBarContainer>
          <ProductsSectionWrapper>
            <ProductCategoryContainer>
              <ProductCategory onCategorySelect={handleCategorySelect} initialCategory={selectedCategory} />
            </ProductCategoryContainer>
            <ProductGridContainer>
              <ProductGrid products={filteredProducts} />
            </ProductGridContainer>
          </ProductsSectionWrapper>
        </ContentWrapper>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default ProductList;
